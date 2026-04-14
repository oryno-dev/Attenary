import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';
import { useLanguage, Language } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  type: 'info' | 'input' | 'language';
  title: string;
  subtitle: string;
  description?: string;
  illustration?: any;
  inputConfig?: {
    placeholder: string;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'words' | 'sentences';
    multiline?: boolean;
    field: 'employeeName' | 'email' | 'jobTitle' | 'department';
  };
}

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));
  const [inputValues, setInputValues] = useState({
    employeeName: '',
    email: '',
    jobTitle: '',
    department: '',
  });
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [inputError, setInputError] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const navigation: any = useNavigation();
  const { 
    completeOnboarding, 
    updateOnboardingProgress,
    setEmployeeName,
    setEmail,
    setJobTitle,
    setDepartment,
  } = useApp();
  const { setLanguage } = useLanguage();
  const { appData } = useApp();

  useEffect(() => {
    if (appData.onboardingCompleted) {
      navigation.replace('Main');
    }
  }, []);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      type: 'info',
      title: 'Welcome to Attenary',
      subtitle: 'Your Smart Attendance System',
      description: 'Track your work hours with precision and ease. Let\'s get you set up in just a few steps.',
      illustration: require('../../assets/on-1.png'),
    },
    {
      id: 'questions',
      type: 'info',
      title: 'Let\'s answer some questions.',
      subtitle: 'We need a few details',
      description: 'This will help us personalize your experience and set up your profile.',
      illustration: require('../../assets/on-2.png'),
    },
    {
      id: 'name',
      type: 'input',
      title: 'What\'s Your Name?',
      subtitle: 'Let\'s personalize your experience',
      description: 'Enter your full name so we can address you properly.',
      illustration: require('../../assets/name.png'),
      inputConfig: {
        placeholder: 'Enter your full name',
        keyboardType: 'default',
        autoCapitalize: 'words',
        field: 'employeeName',
      },
    },
    {
      id: 'email',
      type: 'input',
      title: 'Your Email Address',
      subtitle: 'For important notifications',
      description: 'We\'ll use this to send you reports and updates.',
      illustration: require('../../assets/email.png'),
      inputConfig: {
        placeholder: 'Enter your email address',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        field: 'email',
      },
    },
    {
      id: 'job',
      type: 'input',
      title: 'Your Job Title',
      subtitle: 'Tell us about your role',
      description: 'This helps us customize your reports and analytics.',
      illustration: require('../../assets/jop.png'),
      inputConfig: {
        placeholder: 'e.g., Software Engineer, Manager',
        keyboardType: 'default',
        autoCapitalize: 'words',
        field: 'jobTitle',
      },
    },
    {
      id: 'department',
      type: 'input',
      title: 'Your Department',
      subtitle: 'Where do you work?',
      description: 'Helps organize team attendance and reports.',
      illustration: require('../../assets/department.png'),
      inputConfig: {
        placeholder: 'e.g., Engineering, Marketing',
        keyboardType: 'default',
        autoCapitalize: 'words',
        field: 'department',
      },
    },
    {
      id: 'language',
      type: 'language',
      title: 'Choose Your Language',
      subtitle: 'Select your preferred language',
      description: 'You can change this anytime in the app settings.',
      illustration: require('../../assets/icons/Language.png'),
    },
    {
      id: 'ready',
      type: 'info',
      title: 'You\'re All Set!',
      subtitle: 'Ready to start tracking',
      description: 'Your profile is complete. Let\'s start tracking your attendance!',
      illustration: require('../../assets/on-3.png'),
    },
  ];

  const currentStep = onboardingSteps[currentIndex];
  const totalSteps = onboardingSteps.length;

  const validateCurrentStep = (): boolean => {
    if (currentStep.type === 'input' && currentStep.inputConfig) {
      const field = currentStep.inputConfig.field;
      const value = inputValues[field];
      
      if (!value.trim()) {
        setInputError('This field is required');
        return false;
      }
      
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setInputError('Please enter a valid email address');
          return false;
        }
      }
    }
    
    setInputError('');
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Save input data if this is an input step
    if (currentStep.type === 'input' && currentStep.inputConfig) {
      const field = currentStep.inputConfig.field;
      const value = inputValues[field];
      
      switch (field) {
        case 'employeeName':
          await setEmployeeName(value);
          break;
        case 'email':
          await setEmail(value);
          break;
        case 'jobTitle':
          await setJobTitle(value);
          break;
        case 'department':
          await setDepartment(value);
          break;
      }
    }

    // Save language selection if this is the language step
    // Pass true to skip reload during onboarding to prevent losing progress
    if (currentStep.type === 'language') {
      await setLanguage(selectedLanguage, true);
    }

    if (currentIndex < totalSteps - 1) {
      // Smooth fade transition
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        
        // Update onboarding progress
        updateOnboardingProgress(nextIndex);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (nextIndex + 1) / totalSteps,
          duration: 400,
          useNativeDriver: false,
        }).start();
        
        // Reset fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    } else {
      // Complete onboarding with celebration animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: false,
        }),
      ]).start(async () => {
        await completeOnboarding();
        
        // On web, if Arabic was selected, reload to apply RTL changes
        // This happens after onboarding is saved so progress isn't lost
        if (Platform.OS === 'web' && selectedLanguage === 'ar') {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          navigation.replace('Main');
        }
      });
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: false,
    }).start();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setInputError('');
      // Smooth fade transition for previous
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        
        // Update onboarding progress
        updateOnboardingProgress(prevIndex);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (prevIndex + 1) / totalSteps,
          duration: 400,
          useNativeDriver: false,
        }).start();
        
        // Reset fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
    if (inputError) {
      setInputError('');
    }
  };

  // Initialize progress animation
  useEffect(() => {
    progressAnim.setValue((currentIndex + 1) / totalSteps);
  }, []);

  const renderInputField = () => {
    if (currentStep.type !== 'input' || !currentStep.inputConfig) {
      return null;
    }

    const config = currentStep.inputConfig;
    
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputError ? styles.inputError : null]}
          placeholder={config.placeholder}
          placeholderTextColor={colors.textMuted}
          value={inputValues[config.field]}
          onChangeText={(value) => handleInputChange(config.field, value)}
          keyboardType={config.keyboardType || 'default'}
          autoCapitalize={config.autoCapitalize || 'none'}
          autoCorrect={false}
          selectionColor={colors.primary}
        />
        {inputError ? (
          <Text style={styles.errorText}>{inputError}</Text>
        ) : null}
      </View>
    );
  };

  const renderLanguageSelection = () => {
    if (currentStep.type !== 'language') {
      return null;
    }

    const languages = [
      { code: 'en' as Language, name: 'English', subtitle: 'Left to right (LTR)', flag: require('../../assets/icons/english.png') },
      { code: 'ar' as Language, name: 'العربية', subtitle: 'Right to left (RTL)', flag: require('../../assets/icons/arabic.png') },
    ];

    return (
      <View style={styles.languageContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              selectedLanguage === lang.code && styles.languageOptionSelected,
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
            activeOpacity={0.8}
          >
            <Image source={lang.flag} style={styles.languageFlag} resizeMode="contain" />
            <View style={styles.languageTextContainer}>
              <Text style={[
                styles.languageName,
                selectedLanguage === lang.code && styles.languageNameSelected,
              ]}>
                {lang.name}
              </Text>
              <Text style={styles.languageSubtitle}>{lang.subtitle}</Text>
            </View>
            {selectedLanguage === lang.code && (
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* Step Counter */}
        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>
            Step {currentIndex + 1} of {totalSteps}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Middle Illustration */}
          <Animated.View 
            style={[
              styles.illustrationContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {currentStep.illustration && (
              <Image 
                source={currentStep.illustration} 
                style={styles.centeredIllustration}
                resizeMode="contain"
              />
            )}
          </Animated.View>

          {/* Text Content */}
          <Animated.View style={[styles.textContent, { opacity: fadeAnim }]}>
            <Text style={styles.title}>
              {currentStep.title}
            </Text>
            <Text style={styles.subtitle}>
              {currentStep.subtitle}
            </Text>
            {currentStep.description && (
              <Text style={styles.description}>
                {currentStep.description}
              </Text>
            )}
          </Animated.View>

          {/* Input Field */}
          {renderInputField()}

          {/* Language Selection */}
          {renderLanguageSelection()}

          {/* Navigation Dots */}
          <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex ? colors.primary : colors.textMuted + '40',
                    transform: [
                      {
                        scale: index === currentIndex ? 1.2 : 1,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonsContainer}>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            )}
            
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.nextButton, 
                  { backgroundColor: colors.primary },
                  currentIndex === 0 ? styles.nextButtonFull : null
                ]}
                onPress={handleNext}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                activeOpacity={0.9}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === totalSteps - 1 ? 'Get Started' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepCounter: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepCounterText: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  centeredIllustration: {
    width: 220,
    height: 220,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fonts.sizes.hero,
    fontWeight: fonts.weights.extrabold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: fonts.sizes.lg,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: fonts.sizes.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    fontWeight: fonts.weights.medium as any,
  },
  nextButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  nextButtonFull: {
    width: '100%',
  },
  nextButtonText: {
    fontSize: fonts.sizes.lg,
    color: colors.bgMain,
    fontWeight: fonts.weights.bold as any,
  },
  languageContainer: {
    width: '100%',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  languageFlag: {
    width: 40,
    height: 40,
    marginRight: spacing.md,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textPrimary,
  },
  languageNameSelected: {
    color: colors.primary,
  },
  languageSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.bgMain,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold as any,
  },
});

export default OnboardingScreen;
