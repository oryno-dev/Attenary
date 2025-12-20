import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, fonts } from '../theme/colors';



const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));
  const navigation: any = useNavigation();
  const { completeOnboarding, updateOnboardingProgress } = useApp();

  const onboardingSlides = [
    {
      title: 'Welcome to Attenary',
      subtitle: 'Your Smart Attendance System',
      description: 'Track your work hours with precision and ease. Get started with our intuitive time tracking solution.',
      illustration: require('../../assets/on-1.png'),
      illustrationColor: '#13ec5b',
      illustrationBg: '#13ec5b20',
    },
    {
      title: 'Simple Check-In & Check-Out',
      subtitle: 'One-Tap Time Tracking',
      description: 'Start and end your work sessions with just a tap. No more complicated processes or paperwork.',
      illustration: require('../../assets/on-2.png'),
      illustrationColor: '#13ec5b',
      illustrationBg: '#13ec5b20',
    },
    {
      title: 'Detailed Analytics',
      subtitle: 'Track Your Performance',
      description: 'View your work patterns, generate reports, and understand your productivity trends.',
      illustration: require('../../assets/on-3.png'),
      illustrationColor: '#13ec5b',
      illustrationBg: '#13ec5b20',
    },
  ];

  const handleNext = async () => {
    if (currentIndex < onboardingSlides.length - 1) {
      // Smooth fade transition
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        
        // Update onboarding progress
        updateOnboardingProgress(nextIndex);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (nextIndex + 1) / onboardingSlides.length,
          duration: 400,
          useNativeDriver: false,
        }).start();
        
        // Reset fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Complete onboarding with celebration animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await completeOnboarding();
        navigation.replace('Main');
      });
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.replace('Main');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Smooth fade transition for previous
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        
        // Update onboarding progress
        updateOnboardingProgress(prevIndex);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (prevIndex + 1) / onboardingSlides.length,
          duration: 400,
          useNativeDriver: false,
        }).start();
        
        // Reset fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const currentSlide = onboardingSlides[currentIndex];

  // Initialize progress animation
  useEffect(() => {
    progressAnim.setValue((currentIndex + 1) / onboardingSlides.length);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgMain} />
      
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
          <Image 
            source={currentSlide.illustration} 
            style={styles.centeredIllustration}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
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

          {/* Text Content */}
          <Animated.View style={[styles.textContent, { opacity: fadeAnim }]}>
            <Text style={styles.title}>
              {currentSlide.title}
            </Text>
            <Text style={styles.subtitle}>
              {currentSlide.subtitle}
            </Text>
            <Text style={styles.description}>
              {currentSlide.description}
            </Text>
          </Animated.View>

          {/* Navigation Dots */}
          <View style={styles.dotsContainer}>
            {onboardingSlides.map((_, index) => (
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

          {/* Action Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.fabButton, { backgroundColor: colors.primary }]}
              onPress={handleNext}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={0.9}
            >
              <Text style={styles.fabIcon}>
                {currentIndex === onboardingSlides.length - 1 ? '✓' : '→'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Skip Button */}
          {currentIndex < onboardingSlides.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  centeredIllustration: {
    width: 280,
    height: 280,
  },
  bottomContent: {
    paddingBottom: spacing.xl,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.sizes.hero,
    fontWeight: fonts.weights.extrabold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold as any,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  fabButton: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  fabIcon: {
    fontSize: 32,
    fontWeight: fonts.weights.extrabold as any,
    color: colors.bgMain,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: fonts.sizes.md,
    color: colors.textMuted,
    fontWeight: fonts.weights.medium as any,
  },
});

export default OnboardingScreen;