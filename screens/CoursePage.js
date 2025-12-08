import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CourseData from './CourseData.json';

const localAssetMap = {
  "Hero_Handshape.png": require('../assets/Hero_Handshape.png'),
  "Hero_Expressions.png": require('../assets/Hero_Expressions.png'),
  "Hero_Family.png": require('../assets/Hero_Family.png'),
  "Hero_Time.png": require('../assets/Hero_Time.png'),
  "Hero_Syntax.png": require('../assets/Hero_Syntax.png'),
  "AST.png": require('../assets/AST.png'),
  "KP.png": require('../assets/KP.png'),
  "Where.png": require('../assets/Where.png'),
  "Hungry.png": require('../assets/Hungry.png'),
  "NiceMeet.png": require('../assets/NiceMeet.png'),
  "MaleForeheadFemaleChin.png": require('../assets/MaleForeheadFemaleChin.png'),
  "GrandmotherMother.png": require('../assets/GrandmotherMother.png'),
  "Friend.png": require('../assets/Friend.png'),
  "PastPresent.png": require('../assets/PastPresent.png'),
  "TuesdayThursday.png": require('../assets/TuesdayThursday.png'),
  "V2.png": require('../assets/V2.png'),
  "TopicCarSubjectMeVerbWash.png": require('../assets/TopicCarSubjectMeVerbWash.png'),
  "NegationAffirmation.png": require('../assets/NegationAffirmation.png'),
  "SigningSpace.png": require('../assets/SigningSpace.png'),
  "OSV.png": require('../assets/OSV.png'),

};

const BackArrowIcon = () => (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path fill="#565656" d="m5.543 9.208 3.47 3.471a.65.65 0 0 1 .205.496.71.71 0 0 1-.222.496.75.75 0 0 1-.496.204.647.647 0 0 1-.496-.204L3.33 8.996a.625.625 0 0 1-.15-.23.827.827 0 0 1 .001-.531.606.606 0 0 1 .15-.23l4.675-4.676a.661.661 0 0 1 .487-.195.72.72 0 0 1 .505.195.69.69 0 0 1 .212.505c0 .195-.07.363-.212.505L5.543 7.792h7.915c.201 0 .37.068.505.204a.683.683 0 0 1 .204.504.69.69 0 0 1-.204.505.677.677 0 0 1-.505.203H5.543Z"/>
    </Svg>
);
const HandsIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z"/></Svg>);
const TTSIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z"/></Svg>)
const LearnIcon = () => (<Svg width="26" height = "26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z" clipRule="evenodd"/><Path fill="#565656" fillRule="evenodd" d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z" clipRule="evenodd"/><Path fill="#565656" fillRule="evenodd" d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z" clipRule="evenodd"/></Svg>)
const LogsIcon = () =>(<Svg width="26" height="26" fill="none"><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5"/><Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75"/><Path stroke="#565656" strokeLinecap="round" strokeWidth={2.333} d="M8 8h8m-8 4h4"/></Svg>)
const ProfileIcon = () => (<Svg width="26" height="26" fill="none"><Path fill="#565656" fillRule="evenodd" d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z" clipRule="evenodd"/></Svg>)
const SettingsIcon = () =>(<Svg width="26" height= "26" fill="none"><Path fill="#565656" d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z"/></Svg>)

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Home')}>
        <HandsIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('TTSMode')}>
        <TTSIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('LearningHub')}>
        <LearnIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Logs')}>
        <LogsIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Profile')}>
        <ProfileIcon />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('Settings')}>
        <SettingsIcon />
      </TouchableOpacity>
    </View>
  );
};

export default function CoursePage({ route, navigation }) {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const targetId = route.params?.courseId;
    if (CourseData) {
      const foundCourse = CourseData.find(c => c.id === targetId);
      setCourse(foundCourse);
    }
  }, [route.params]);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#555" style={{ marginTop: 50 }} />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading Course...</Text>
      </SafeAreaView>
    )
  }

  const heroImage = course.heroImageFileName ? localAssetMap[course.heroImageFileName] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={{ marginTop: 2 }}>
            <BackArrowIcon />
          </View>
          <Text style={styles.backText}>Back to courses</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{course.title}</Text>

        <View style={styles.TopImageContainer}>
          {heroImage ? (
             <Image 
                source={heroImage} 
                style={styles.heroImageStyle} 
                resizeMode="cover" 
              />
          ) : (
             <Text style={styles.placeholder}>[ Hero Image ]</Text>
          )}
        </View>

        <Text style={styles.sectionHeader}>About this course</Text>
        <Text style={styles.descriptionText}>{course.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>Course Content</Text>

        {course.modules && course.modules.map((module, index) => {
          const resolvedImage = module.imageFileName ? localAssetMap[module.imageFileName] : null;

          return (
            <View key={module.id} style={styles.moduleContainer}>
              
              <View style={styles.moduleHeaderRow}>
                <View style={styles.moduleNumberBadge}>
                  <Text style={styles.moduleNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.moduleTitle}>{module.title}</Text>
              </View>

              <View style={styles.mediaContainer}>
                {resolvedImage ? (
                  <Image 
                    source={resolvedImage} 
                    style={styles.moduleImage} 
                    resizeMode="contain" 
                  />
                ) : (
                  <View style={styles.placeholderInner}>
                     <Text style={styles.placeholderNote}>{module.media_placeholder_note || "No Image Available"}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.bodyText}>{module.content}</Text>
            
            </View>
          );
        })}

      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E6E1", 
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginVertical: 15,
  },
  backText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#565656',
  },
  navContainer: {
    position: "absolute",
    height: 80,
    width: "100%",
    bottom: 0,
    backgroundColor: '#E0E0E0',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  TopImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    overflow: 'hidden', 
  },
  heroImageStyle: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: '#888',
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginVertical: 25,
  },
  
  moduleContainer: {
    backgroundColor: '#F4F3F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  moduleNumberBadge: {
    backgroundColor: '#333',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  moduleNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  mediaContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#EBE9E4',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  moduleImage: {
    width: '100%',
    height: '100%',
  },
  placeholderInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  placeholderNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  }
});