import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export const GetStartedScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const scrollViewRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animation values for splash screen
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(30)).current;

  // Theme-aware styles
  const dynamicStyles = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    textColor: theme === 'dark' ? '#ffffff' : '#111418',
    mutedText: theme === 'dark' ? '#a0a0a0' : '#637587',
    borderColor: theme === 'dark' ? '#404040' : '#e2e8f0',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    primaryColor: '#197ce5',
  };

  // Splash screen animation
  useEffect(() => {
    if (showSplash) {
      // Logo animation sequence
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Text animation sequence
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(textSlide, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Tagline animation
      Animated.sequence([
        Animated.delay(1200),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(taglineSlide, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Auto-hide splash after 7 seconds
      const timer = setTimeout(() => {
        hideSplash();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const hideSplash = () => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSplash(false);
    });
  };

  const slides = [
    {
      id: 1,
      title: 'Welcome to MedAlert',
      subtitle: 'Your Safety, Our Priority',
      content: [
        {
          icon: 'shield',
          title: 'Quick and Easy Reporting',
          description: 'Report medication safety concerns in minutes with our streamlined process.',
        },
        {
          icon: 'alert-triangle',
          title: 'Immediate Alerts',
          description: 'Get instant notifications about drug recalls and safety warnings.',
        },
        {
          icon: 'users',
          title: 'Community Protection',
          description: 'Help protect others by reporting issues you encounter.',
        },
      ],
    },
    {
      id: 2,
      title: 'What We Do',
      subtitle: 'Comprehensive Medication Safety',
      content: [
        {
          icon: 'search',
          title: 'Drug Verification',
          description: 'Verify medication authenticity using barcode scanning and digital verification.',
        },
        {
          icon: 'map-pin',
          title: 'Location Tracking',
          description: 'Track and report issues from specific pharmacies and locations.',
        },
        {
          icon: 'book-open',
          title: 'Educational Resources',
          description: 'Access comprehensive guides on medication safety and proper usage.',
        },
        {
          icon: 'message-circle',
          title: 'Community Forum',
          description: 'Connect with others and share experiences in our safety-focused community.',
        },
      ],
    },
    {
      id: 3,
      title: 'How It Works',
      subtitle: 'Simple Steps to Safety',
      content: [
        {
          icon: 'camera',
          title: '1. Scan & Report',
          description: 'Use your camera to scan medication barcodes and report any issues.',
        },
        {
          icon: 'bell',
          title: '2. Get Notified',
          description: 'Receive real-time alerts about safety concerns and recalls.',
        },
        {
          icon: 'users',
          title: '3. Stay Connected',
          description: 'Join our community to stay informed and help others.',
        },
        {
          icon: 'trending-up',
          title: 'Impact Statistics',
          description: 'Over 10,000+ safety reports filed, helping protect communities nationwide.',
        },
      ],
    },
  ];

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
      animateSlideChange(nextSlide);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
      animateSlideChange(prevSlide);
    }
  };

  const animateSlideChange = (slideIndex) => {
    Animated.timing(slideAnim, {
      toValue: slideIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
      animateSlideChange(slideIndex);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  // Splash Screen Component
  const SplashScreen = () => (
    <View style={[styles.splashContainer, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Enhanced Background Pattern */}
      <View style={styles.backgroundPattern}>
        {/* Large gradient circles */}
        <View style={[styles.gradientCircle, styles.gradientCircle1]} />
        <View style={[styles.gradientCircle, styles.gradientCircle2]} />
        <View style={[styles.gradientCircle, styles.gradientCircle3]} />
        
        {/* Subtle pattern circles */}
        <View style={[styles.patternCircle, styles.patternCircle1, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle2, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle3, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle4, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle5, { backgroundColor: dynamicStyles.primaryColor }]} />
        
        {/* Floating particles */}
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
        <View style={[styles.particle, styles.particle4]} />
        <View style={[styles.particle, styles.particle5]} />
        <View style={[styles.particle, styles.particle6]} />
        
        {/* Splash screen specific design elements */}
        <View style={[styles.splashDesign, styles.splashDesign1]} />
        <View style={[styles.splashDesign, styles.splashDesign2]} />
        <View style={[styles.splashDesign, styles.splashDesign3]} />
        <View style={[styles.splashDesign, styles.splashDesign4]} />
        
        {/* Geometric patterns */}
        <View style={[styles.geometricShape, styles.geometricShape1]} />
        <View style={[styles.geometricShape, styles.geometricShape2]} />
        <View style={[styles.geometricShape, styles.geometricShape3]} />
        
        {/* Subtle lines and curves */}
        <View style={[styles.curveLine, styles.curveLine1]} />
        <View style={[styles.curveLine, styles.curveLine2]} />
        <View style={[styles.curveLine, styles.curveLine3]} />
        
        {/* Additional sophisticated elements */}
        <View style={[styles.accentElement, styles.accentElement1]} />
        <View style={[styles.accentElement, styles.accentElement2]} />
        <View style={[styles.accentElement, styles.accentElement3]} />
        
        {/* Subtle corner decorations */}
        <View style={[styles.cornerDecor, styles.cornerDecor1]} />
        <View style={[styles.cornerDecor, styles.cornerDecor2]} />
        <View style={[styles.cornerDecor, styles.cornerDecor3]} />
        <View style={[styles.cornerDecor, styles.cornerDecor4]} />
      </View>
      
      {/* Enhanced Gradient Overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: dynamicStyles.backgroundColor }]} />
      
      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={[styles.logoBackground, { backgroundColor: dynamicStyles.primaryColor }]}>
          {/* Glow effect behind logo */}
          <View style={[styles.logoGlow, { backgroundColor: dynamicStyles.primaryColor }]} />
          
          {/* Main Shield */}
          <View style={styles.shieldContainer}>
            <Icon name="shield" size={60} color="#ffffff" />
          </View>
          
          {/* Cross Symbol for Medical - positioned in center */}
          <View style={styles.crossContainer}>
            <Icon name="plus" size={24} color="#ffffff" />
          </View>
          
          {/* Alert Triangle - positioned at top right */}
          <View style={styles.alertContainer}>
            <Icon name="alert-triangle" size={20} color="#ffffff" />
          </View>
          
          {/* Pulse Lines - positioned at bottom */}
          <View style={styles.pulseContainer}>
            <View style={styles.pulseLine} />
            <View style={[styles.pulseLine, styles.pulseLine2]} />
            <View style={[styles.pulseLine, styles.pulseLine3]} />
          </View>
        </View>
      </Animated.View>

      {/* Animated App Name */}
      <Animated.View
        style={[
          styles.appNameContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        <Text style={[styles.appName, { color: dynamicStyles.textColor }]}>
          MedAlert
        </Text>
      </Animated.View>

      {/* Animated Tagline */}
      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineSlide }],
          },
        ]}
      >
        <Text style={[styles.tagline, { color: dynamicStyles.mutedText }]} numberOfLines={3} allowFontScaling={true}>
          Your Safety, Our Priority
        </Text>
      </Animated.View>

      {/* Skip Button */}
      <TouchableOpacity
        style={[styles.skipButton, { borderColor: dynamicStyles.borderColor }]}
        onPress={hideSplash}
      >
        <Text style={[styles.skipButtonText, { color: dynamicStyles.mutedText }]}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSlide = (slide, index) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <ScrollView 
        contentContainerStyle={styles.slideContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.slideTitle, { color: dynamicStyles.textColor }]}>
            {slide.title}
          </Text>
          <Text style={[styles.slideSubtitle, { color: dynamicStyles.mutedText }]}>
            {slide.subtitle}
          </Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {slide.content.map((item, itemIndex) => (
            <View key={itemIndex} style={[styles.contentCard, { backgroundColor: dynamicStyles.cardBackground }]}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={32} color={dynamicStyles.primaryColor} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.contentTitle, { color: dynamicStyles.textColor }]}>
                  {item.title}
                </Text>
                <Text style={[styles.contentDescription, { color: dynamicStyles.mutedText }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Section for Last Slide */}
        {index === slides.length - 1 && (
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.getStartedButton, { backgroundColor: dynamicStyles.primaryColor }]}
              onPress={goToLogin}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
              <Icon name="arrow-right" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      {/* Enhanced Background Pattern for Main Screens */}
      <View style={styles.backgroundPattern}>
        {/* Large gradient circles */}
        <View style={[styles.gradientCircle, styles.gradientCircle1]} />
        <View style={[styles.gradientCircle, styles.gradientCircle2]} />
        <View style={[styles.gradientCircle, styles.gradientCircle3]} />
        
        {/* Subtle pattern circles */}
        <View style={[styles.patternCircle, styles.patternCircle1, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle2, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle3, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle4, { backgroundColor: dynamicStyles.primaryColor }]} />
        <View style={[styles.patternCircle, styles.patternCircle5, { backgroundColor: dynamicStyles.primaryColor }]} />
        
        {/* Floating particles */}
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
        <View style={[styles.particle, styles.particle4]} />
        <View style={[styles.particle, styles.particle5]} />
        <View style={[styles.particle, styles.particle6]} />
        
        {/* Additional decorative elements */}
        <View style={[styles.decorativeLine, styles.decorativeLine1]} />
        <View style={[styles.decorativeLine, styles.decorativeLine2]} />
        <View style={[styles.decorativeLine, styles.decorativeLine3]} />
        
        {/* Enhanced background elements */}
        <View style={[styles.backgroundShape, styles.backgroundShape1]} />
        <View style={[styles.backgroundShape, styles.backgroundShape2]} />
        <View style={[styles.backgroundShape, styles.backgroundShape3]} />
        <View style={[styles.backgroundShape, styles.backgroundShape4]} />
        
        {/* Subtle grid pattern */}
        <View style={styles.gridPattern}>
          <View style={[styles.gridLine, styles.gridLine1]} />
          <View style={[styles.gridLine, styles.gridLine2]} />
          <View style={[styles.gridLine, styles.gridLine3]} />
          <View style={[styles.gridLine, styles.gridLine4]} />
        </View>
      </View>
      
      {/* Enhanced Gradient Overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: dynamicStyles.backgroundColor }]} />
      
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentSlide ? dynamicStyles.primaryColor : dynamicStyles.borderColor,
              },
            ]}
          />
        ))}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.slidesContainer}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentSlide > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { borderColor: dynamicStyles.borderColor }]}
            onPress={goToPreviousSlide}
          >
            <Icon name="chevron-left" size={24} color={dynamicStyles.textColor} />
            <Text style={[styles.navButtonText, { color: dynamicStyles.textColor }]}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentSlide < slides.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, { borderColor: dynamicStyles.primaryColor }]}
            onPress={goToNextSlide}
          >
            <Text style={[styles.navButtonText, { color: dynamicStyles.primaryColor }]}>Next</Text>
            <Icon name="chevron-right" size={24} color={dynamicStyles.primaryColor} />
          </TouchableOpacity>
        )}

        {currentSlide === slides.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.skipButton]}
            onPress={goToLogin}
          >
            <Text style={[styles.navButtonText, { color: dynamicStyles.mutedText }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#197ce5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  appNameContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
  },
  taglineContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    minHeight: 60,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    flexWrap: 'wrap',
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 100,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Main Screen Styles
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slidesContainer: {
    flexGrow: 1,
  },
  slide: {
    flex: 1,
  },
  slideContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: height - 200,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentSection: {
    flex: 1,
    gap: 20,
  },
  contentCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(25, 124, 229, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(25, 124, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#197ce5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  contentDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  getStartedButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  nextButton: {
    backgroundColor: 'rgba(25, 124, 229, 0.1)',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  shieldContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  pulseLine: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  pulseLine2: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  pulseLine3: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  // New styles for background pattern
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.03, // Very subtle opacity
  },
  patternCircle1: {
    width: 200,
    height: 200,
    top: '10%',
    left: '-10%',
  },
  patternCircle2: {
    width: 300,
    height: 300,
    top: '60%',
    right: '-15%',
  },
  patternCircle3: {
    width: 250,
    height: 250,
    bottom: '5%',
    left: '20%',
  },
  patternCircle4: {
    width: 180,
    height: 180,
    bottom: '40%',
    right: '10%',
  },
  patternCircle5: {
    width: 220,
    height: 220,
    top: '80%',
    left: '50%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95, // Stronger overlay to ensure text readability
    zIndex: -1,
  },
  // New styles for enhanced splash screen
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  logoGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.3,
    zIndex: -1,
    elevation: 8,
    shadowColor: '#197ce5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.05,
  },
  gradientCircle1: {
    width: 300,
    height: 300,
    top: '20%',
    left: '-20%',
    backgroundColor: 'rgba(25, 124, 229, 0.08)',
  },
  gradientCircle2: {
    width: 400,
    height: 400,
    bottom: '30%',
    right: '-30%',
    backgroundColor: 'rgba(25, 124, 229, 0.06)',
  },
  gradientCircle3: {
    width: 250,
    height: 250,
    top: '70%',
    left: '50%',
    backgroundColor: 'rgba(25, 124, 229, 0.05)',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.1,
  },
  particle1: {
    top: '10%',
    left: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  particle2: {
    top: '40%',
    right: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  particle3: {
    bottom: '20%',
    left: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  particle4: {
    bottom: '50%',
    right: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle5: {
    top: '70%',
    left: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  particle6: {
    bottom: '10%',
    right: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  decorativeLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeLine1: {
    top: '20%',
  },
  decorativeLine2: {
    top: '50%',
  },
  decorativeLine3: {
    bottom: '20%',
  },
  // New styles for enhanced background shapes
  backgroundShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.05,
  },
  backgroundShape1: {
    width: 300,
    height: 300,
    top: '10%',
    left: '-10%',
    backgroundColor: 'rgba(25, 124, 229, 0.1)',
  },
  backgroundShape2: {
    width: 400,
    height: 400,
    bottom: '30%',
    right: '-20%',
    backgroundColor: 'rgba(25, 124, 229, 0.08)',
  },
  backgroundShape3: {
    width: 250,
    height: 250,
    top: '70%',
    left: '50%',
    backgroundColor: 'rgba(25, 124, 229, 0.12)',
  },
  backgroundShape4: {
    width: 180,
    height: 180,
    bottom: '40%',
    right: '10%',
    backgroundColor: 'rgba(25, 124, 229, 0.06)',
  },
  // New styles for grid pattern
  gridPattern: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 200,
    height: 200,
    opacity: 0.05,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridLine1: {
    width: 1,
    height: '100%',
    left: '50%',
  },
  gridLine2: {
    width: '100%',
    height: 1,
    top: '50%',
  },
  gridLine3: {
    width: 1,
    height: '100%',
    right: '50%',
  },
  gridLine4: {
    width: '100%',
    height: 1,
    bottom: '50%',
  },
  // New styles for splash screen specific design elements
  splashDesign: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.05,
  },
  splashDesign1: {
    width: 350,
    height: 350,
    top: '5%',
    left: '-15%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 175,
  },
  splashDesign2: {
    width: 450,
    height: 450,
    bottom: '20%',
    right: '-25%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 225,
  },
  splashDesign3: {
    width: 300,
    height: 300,
    top: '65%',
    left: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 150,
  },
  splashDesign4: {
    width: 220,
    height: 220,
    bottom: '35%',
    right: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 110,
  },
  // New styles for geometric shapes
  geometricShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.03,
  },
  geometricShape1: {
    width: 200,
    height: 200,
    top: '30%',
    left: '-10%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  geometricShape2: {
    width: 300,
    height: 300,
    bottom: '20%',
    right: '-15%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  geometricShape3: {
    width: 250,
    height: 250,
    top: '60%',
    left: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  // New styles for subtle lines and curves
  curveLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  curveLine1: {
    top: '20%',
  },
  curveLine2: {
    top: '50%',
  },
  curveLine3: {
    bottom: '20%',
  },
  // New styles for additional sophisticated elements
  accentElement: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.05,
  },
  accentElement1: {
    width: 250,
    height: 250,
    top: '15%',
    left: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  accentElement2: {
    width: 350,
    height: 350,
    bottom: '25%',
    right: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  accentElement3: {
    width: 200,
    height: 200,
    top: '70%',
    left: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  // New styles for subtle corner decorations
  cornerDecor: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.08,
  },
  cornerDecor1: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerDecor2: {
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerDecor3: {
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerDecor4: {
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
