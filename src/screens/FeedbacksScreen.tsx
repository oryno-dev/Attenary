import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, fonts, shadows } from '../theme/colors';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { FEEDBACK_API_URL, FEEDBACK_CONFIG } from '../config/feedback';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const SendIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={colors.bgMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BackIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FeedbackIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={colors.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 9h8M8 13h6" stroke={colors.secondary} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const FeedbacksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'feature'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;

  /**
   * Map local feedback type to API expected format
   */
  const getApiFeedbackType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'general': 'general_feedback',
      'bug': 'bug_report',
      'feature': 'feature_request',
    };
    return typeMap[type] || 'general_feedback';
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  /**
   * Submit feedback to Google Sheets via Apps Script Web App
   */
  const handleSubmit = async () => {
    console.log('handleSubmit called');
    
    // Validate feedback content
    if (!feedback.trim()) {
      Alert.alert(t('common.error'), t('feedbacks.pleaseEnterFeedback'));
      return;
    }

    // Validate feedback length
    if (feedback.trim().length < FEEDBACK_CONFIG.MIN_LENGTH) {
      Alert.alert(t('common.error'), t('feedbacks.feedbackMinLength').replace('{minLength}', FEEDBACK_CONFIG.MIN_LENGTH.toString()));
      return;
    }

    // Validate email if provided
    if (email.trim() && !isValidEmail(email.trim())) {
      Alert.alert(t('common.error'), t('feedbacks.validEmail'));
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, returning');
      return;
    }

    setIsSubmitting(true);
    console.log('Starting submission...');

    try {
      // Build payload matching the backend API format
      const payload = {
        feedbackType: getApiFeedbackType(feedbackType),
        email: email.trim().toLowerCase() || 'not_provided@example.com',
        content: feedback.trim(),
        timestamp: new Date().toISOString(),
        metadata: {
          userAgent: 'Attenary Mobile App',
          referrer: 'React Native App',
          screenResolution: `${Math.round(Dimensions.get('window').width)}x${Math.round(Dimensions.get('window').height)}`,
        },
      };

      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('API URL:', FEEDBACK_API_URL);

      // Send to Google Apps Script Web App
      // Note: Adding proper CORS support with correct configuration
      console.log('Sending fetch request with proper CORS headers...');
      
      try {
        const response = await fetch(FEEDBACK_API_URL, {
          method: 'POST',
          mode: 'cors', // Changed from 'no-cors' to enable proper CORS
          headers: {
            'Content-Type': 'application/json', // Changed from 'text/plain' to proper JSON content type
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Try to parse response
        let responseData;
        try {
          responseData = await response.json();
          console.log('Response data:', responseData);
        } catch (parseError) {
          console.log('Could not parse response as JSON:', parseError);
          responseData = null;
        }

        if (!response.ok) {
          console.error('Server returned error:', responseData);
          throw new Error(responseData?.error?.message || `Server error: ${response.status}`);
        }

        if (responseData?.success) {
          console.log('Feedback submitted successfully!');
          setRetryAttempts(0); // Reset retry counter on success
          Alert.alert(
            t('feedbacks.thankYou'),
            t('feedbacks.feedbackSuccess'),
            [
              {
                text: t('common.ok'),
                onPress: () => {
                  setFeedback('');
                  setEmail('');
                  setFeedbackType('general');
                  navigation.goBack();
                },
              },
            ]
          );
        } else {
          throw new Error(responseData?.error?.message || t('feedbacks.unknownError'));
        }
      } catch (fetchError: any) {
        console.error('Fetch error details:', {
          message: fetchError.message,
          name: fetchError.name,
          stack: fetchError.stack,
        });
        throw fetchError;
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      const canRetry = retryAttempts < MAX_RETRY_ATTEMPTS;
      const remainingAttempts = MAX_RETRY_ATTEMPTS - retryAttempts;
      
      Alert.alert(
        t('feedbacks.connectionError'),
        canRetry 
          ? t('feedbacks.connectionErrorRetry').replace('{remaining}', remainingAttempts.toString())
          : t('feedbacks.maxRetryReached'),
        canRetry 
          ? [
              { text: t('feedbacks.cancel'), style: 'cancel', onPress: () => setRetryAttempts(0) },
              { 
                text: t('feedbacks.retry'), 
                onPress: () => {
                  setRetryAttempts(retryAttempts + 1);
                  handleSubmit();
                } 
              },
            ]
          : [
              { text: t('common.ok'), onPress: () => setRetryAttempts(0) },
            ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { id: 'general', label: t('feedbacks.general') },
    { id: 'bug', label: t('feedbacks.bugReport') },
    { id: 'feature', label: t('feedbacks.featureRequest') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('feedbacks.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon Section */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <FeedbackIcon size={48} />
            </View>
            <Text style={styles.title}>{t('feedbacks.weValueYourFeedback')}</Text>
            <Text style={styles.subtitle}>
              {t('feedbacks.helpUsImprove')}
            </Text>
          </View>

          {/* Feedback Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('feedbacks.feedbackType')}</Text>
            <View style={styles.typeContainer}>
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    feedbackType === type.id && styles.typeButtonActive
                  ]}
                  onPress={() => setFeedbackType(type.id as any)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    feedbackType === type.id && styles.typeButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('feedbacks.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('feedbacks.emailPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Feedback Input */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('feedbacks.yourFeedback')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('feedbacks.placeholder')}
              placeholderTextColor={colors.textMuted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.bgMain} size="small" />
            ) : (
              <SendIcon size={20} />
            )}
            <Text style={styles.submitButtonText}>
              {isSubmitting ? t('feedbacks.submitting') : t('feedbacks.submit')}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            {t('feedbacks.feedbackInfoText')}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgMain,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bgGlassLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium as any,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.textPrimary,
  },
  textArea: {
    height: 150,
    paddingTop: spacing.md,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
    ...shadows.button,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold as any,
    color: colors.bgMain,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
  },
});

export default FeedbacksScreen;
