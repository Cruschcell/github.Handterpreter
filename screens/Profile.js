import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {useFocusEffect} from '@react-navigation/native'
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HandsIcon = () => (
  <Svg width="26" height="26" fill="none">
    <Path fill="#565656" d="m13.53 14.083-1.007-2.015a1.623 1.623 0 0 1 .726-2.177l.282-.141 6.207 5.915c.542.51.845 1.224.845 1.96v5.667A2.708 2.708 0 0 1 17.875 26H5.958a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h4.875V22.75h-6.5a1.087 1.087 0 0 1-1.083-1.083c0-.596.488-1.084 1.083-1.084h6.5V19.5H3.25a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h7.583V16.25H4.875a1.087 1.087 0 0 1-1.083-1.083c0-.596.487-1.084 1.083-1.084h8.656Zm-.768-6.37c-.91.434-1.268.672-1.766 1.29L8.07 5.914a1.08 1.08 0 0 1 1.57-1.484l3.12 3.282Zm-2.319 2.264a3.75 3.75 0 0 0-.216 1.94h-.932l-2.46-2.59A1.07 1.07 0 0 1 6.88 7.8a1.079 1.079 0 0 1 1.528.043l2.036 2.134Zm11.581 5.092.954-.899c.541-.51.855-1.224.855-1.972V3.63l-.292-.108a1.623 1.623 0 0 0-2.08.975l-.77 2.123L14.734.336a1.08 1.08 0 1 0-1.57 1.484l4.105 4.322-.79.748-5.222-5.503a1.079 1.079 0 0 0-1.866.711 1.08 1.08 0 0 0 .295.773l4.095 4.311 2.882 2.568 3.91 3.716.661.628c.315.293.575.618.791.975Z" />
  </Svg>
);

const TTSIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path fill="#565656" d="M4.5 24.75c-.619 0-1.148-.22-1.588-.66a2.17 2.17 0 0 1-.662-1.59v-18c0-.619.22-1.148.662-1.588.44-.44.97-.661 1.588-.662h9.169l-2.25 2.25H4.5v18h12.375v-2.25h2.25v2.25a2.17 2.17 0 0 1-.66 1.59c-.44.44-.97.66-1.59.66H4.5Zm2.25-4.5V18h7.875v2.25H6.75Zm0-3.375v-2.25h5.625v2.25H6.75Zm10.125 0-4.5-4.5H9V6.75h3.375l4.5-4.5v14.625Zm2.25-3.431V5.68a4.606 4.606 0 0 1 1.631 1.603c.413.675.619 1.435.619 2.279 0 .843-.206 1.603-.619 2.278a4.606 4.606 0 0 1-1.631 1.603Zm0 4.837V15.92c1.313-.469 2.39-1.28 3.234-2.433.844-1.152 1.266-2.46 1.266-3.924 0-1.463-.422-2.77-1.266-3.923-.843-1.153-1.922-1.964-3.234-2.433V.844c1.95.506 3.563 1.56 4.837 3.164 1.276 1.604 1.913 3.455 1.913 5.554 0 2.1-.637 3.952-1.913 5.556-1.274 1.604-2.887 2.658-4.837 3.163Z" />
    </Svg>
)

const LearnIcon = () => (
    <Svg width="26" height = "26" fill="none">
        <Path fill="#565656" fillRule="evenodd" d="M4.219 14.221v3.68a3.094 3.094 0 0 0 1.766 2.794l5.625 2.671a3.094 3.094 0 0 0 2.655 0l5.625-2.67a3.095 3.095 0 0 0 1.766-2.795v-3.679l-7.284 3.642a3.207 3.207 0 0 1-2.869 0L4.22 14.22Z" clipRule="evenodd" />
        <Path fill="#565656" fillRule="evenodd" d="M12.258 3.897a1.52 1.52 0 0 1 1.359 0l9.74 4.87c1.12.56 1.12 2.157 0 2.717l-9.74 4.871a1.52 1.52 0 0 1-1.359 0l-9.74-4.871c-1.12-.56-1.12-2.158 0-2.717l9.74-4.87Z" clipRule="evenodd" />
        <Path fill="#565656" fillRule="evenodd" d="M22.309 9.186a.844.844 0 0 1 1.131-.378l2.25 1.125a.843.843 0 0 1 .466.755v3.937a.844.844 0 1 1-1.687 0V11.21l-1.783-.893a.844.844 0 0 1-.377-1.131Z" clipRule="evenodd" />
    </Svg>
)

const LogsIcon = () =>(
    <Svg width="26" height="26" fill="none">
        <Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="M12 22H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9m-2.25 10v-6.5" />
        <Path stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.333} d="m15.5 17.25.75-.75 1.5-1.5 1.5 1.5.75.75" />
        <Path stroke="#565656" strokeLinecap="round" strokeWidth={2.333} d="M8 8h8m-8 4h4" />
    </Svg>
)

const ProfileIcon = () => (
    <Svg width="26" height="26" fill="none">
        <Path fill="#565656" fillRule="evenodd" d="M8.667 7.583a4.333 4.333 0 1 1 8.666 0 4.333 4.333 0 0 1-8.666 0Zm0 6.5A5.417 5.417 0 0 0 3.25 19.5a3.25 3.25 0 0 0 3.25 3.25h13a3.25 3.25 0 0 0 3.25-3.25 5.417 5.417 0 0 0-5.417-5.417H8.667Z" clipRule="evenodd" />
    </Svg>
)

const SettingsIcon = () =>(
    <Svg width="26" height= "26" fill="none">
        <Path fill="#565656" d="M21.125 13c0-.25-.011-.488-.033-.737l2.015-1.527a1.09 1.09 0 0 0 .282-1.408l-2.026-3.5a1.07 1.07 0 0 0-1.354-.455l-2.33.986c-.4-.281-.822-.53-1.267-.736l-.314-2.503a1.087 1.087 0 0 0-1.072-.953h-4.041a1.09 1.09 0 0 0-1.083.953l-.315 2.503a8.22 8.22 0 0 0-1.267.736l-2.33-.986a1.07 1.07 0 0 0-1.353.455L2.61 9.338a1.092 1.092 0 0 0 .281 1.409l2.015 1.527a7.909 7.909 0 0 0 0 1.463l-2.015 1.527a1.09 1.09 0 0 0-.281 1.409l2.026 3.499c.27.476.855.671 1.354.455l2.329-.986c.4.282.823.53 1.267.737l.315 2.502c.065.542.53.953 1.072.953h4.04c.543 0 1.008-.411 1.073-.953l.314-2.502a8.218 8.218 0 0 0 1.268-.737l2.33.986a1.07 1.07 0 0 0 1.353-.455l2.026-3.5a1.092 1.092 0 0 0-.282-1.408l-2.015-1.527c.033-.25.044-.488.044-.737Zm-8.082 3.792c-2.09 0-3.791-1.701-3.791-3.792 0-2.09 1.7-3.792 3.791-3.792S16.835 10.91 16.835 13c0 2.09-1.701 3.792-3.792 3.792Z" />
    </Svg>
)

const EyeIcon = () =>(
  <Svg width="32" height="32" fill="none">
    <Path fill="#565656"
      d="M15 11.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0 10a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Zm0-15.625C8.75 5.625 3.412 9.512 1.25 15c2.163 5.488 7.5 9.375 13.75 9.375S26.587 20.488 28.75 15C26.587 9.512 21.25 5.625 15 5.625Z"/>
  </Svg>
);

const EyeClosedIcon = () =>(
  <Svg width="30" height="27" fill="none">
    <Path
      fill="#565656"
      d="M16.237 12.922A3.25 3.25 0 0 0 13 9.75l3.237 3.172Z"
    />
    <Path
      fill="#565656"
      d="M10.66 7.67A5.72 5.72 0 0 1 13 7.15 5.85 5.85 0 0 1 18.85 13a5.59 5.59 0 0 1-.377 2.015l3.627 3.367A18.2 18.2 0 0 0 26 13s-3.9-9.1-13-9.1a12.48 12.48 0 0 0-5.2 1.105l2.86 2.665ZM2.6 2.6 1.3 3.9l3.315 3.12A18.07 18.07 0 0 0 0 13s3.9 9.1 13 9.1a12.61 12.61 0 0 0 6.032-1.508L23.4 24.7l1.3-1.3L2.6 2.6ZM13 18.85A5.85 5.85 0 0 1 7.15 13a5.785 5.785 0 0 1 .78-2.86l1.989 1.872A3.25 3.25 0 0 0 9.75 13a3.237 3.237 0 0 0 4.433 3.016l2.002 1.885c-.947.62-2.054.95-3.185.949Z"
    />
  </Svg>
);

const EditIcon = () =>(
  <Svg width="24" height="20">
      <Path
      fill="#565656"
      d="M17.71 4.043c.39-.39.39-1.04 0-1.41L15.37.292c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M0 14.253v3.75h3.75l11.06-11.07-3.75-3.75L0 14.253Z"
    />
  </Svg>
)

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const BottomNavBar = ({navigation}) => {
  return (
    <View style={styles.navContainer}>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Home')}>
            <HandsIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=> navigation.navigate('TTSMode')}>
            <TTSIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('LearningHub')}>
            <LearnIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Logs')}>
            <LogsIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Profile')}>
            <ProfileIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={()=>navigation.navigate('Settings')}>
            <SettingsIcon/>
        </TouchableOpacity>
    </View>
  );
};

const MenuRow = ({ label, onPress, isLast }) => {
  const isSignOut = label === "Sign Out";
  return (
    <TouchableOpacity 
      style={[styles.menuRow, !isLast && styles.menuRowBorder]} 
      onPress={onPress}
    >
      <Text style={[styles.menuText, isSignOut && { color: "#d80101" }]}>
        {label}
      </Text>
      <Text style={styles.arrowText}>{'>'}</Text> 
    </TouchableOpacity>
  );
};

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '', 
    photoURI: null, 
  });
  
  const [modals, setModals] = useState({
    email: false,
    password: false,
    username: false,
  });

  const [inputData, setInputData] = useState({
    newEmail: '',
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const userJson = await AsyncStorage.getItem('currentUser');
          if (userJson) {
            const user = JSON.parse(userJson);
            setUserData(prev => ({
              ...prev,
              ...user,
              password: user.password || prev.password
            }));
          }
        } catch (error) {
          console.log("Error fetching user data", error);
        }
      };

      fetchUserData();
    }, [])
  );

  const updateStorage = async (newUserData) => {
    try {
        setUserData(newUserData);
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUserData));

        const usersJson = await AsyncStorage.getItem('users');
        let users = usersJson ? JSON.parse(usersJson) : [];

        const userIndex = users.findIndex(u => u.id === newUserData.id);

        if (userIndex !== -1) {
            users[userIndex] = newUserData; 
            await AsyncStorage.setItem('users', JSON.stringify(users)); 
            console.log("User synced to main database successfully");
        } else {
            console.log("Could not find user in main database to update");
        }

    } catch (error) {
        console.error("Failed to update storage", error);
        Alert.alert("Error", "Failed to save changes.");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const updated = { ...userData, photoURI: result.assets[0].uri };
        updateStorage(updated);
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick image");
    }
  };

  const handleChangeEmail = () => {
    setErrors({});
    if (!inputData.newEmail.trim()) {
        setErrors(prev => ({ ...prev, email: 'Email cannot be empty' }));
        return;
    }
    if (!inputData.newEmail.includes('@')) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
        return;
    }

    const updated = { ...userData, email: inputData.newEmail };
    updateStorage(updated);
    setModals(prev => ({ ...prev, email: false }));
    setInputData(prev => ({ ...prev, newEmail: '' }));
  };

  const handleChangeUsername = () => {
    setErrors({});
    if (!inputData.newUsername.trim()) {
        setErrors(prev => ({ ...prev, username: 'Username cannot be empty' }));
        return;
    }

    const updated = { ...userData, username: inputData.newUsername };
    updateStorage(updated); 
    setModals(prev => ({ ...prev, username: false }));
    setInputData(prev => ({ ...prev, newUsername: '' }));
  };

  const handleChangePassword = () => {
    setErrors({});
    let hasError = false;

    if (inputData.currentPassword !== userData.password) {
      setErrors(prev => ({ ...prev, currentPassword: "Old password does not match." }));
      hasError = true;
    }
    
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!inputData.newPassword.trim()) {
        setErrors(prev => ({ ...prev, newPassword: "New password cannot be empty." }));
        hasError = true;
    } else if (inputData.newPassword.length < 10) {
        setErrors(prev => ({ ...prev, newPassword: "Password must be at least 10 characters." }));
        hasError = true;
    } else if (!hasNumber.test(inputData.newPassword)) {
        setErrors(prev => ({ ...prev, newPassword: "Password must contain at least 1 number." }));
        hasError = true;
    } else if (!hasSpecialChar.test(inputData.newPassword)) {
        setErrors(prev => ({ ...prev, newPassword: "Password must contain at least 1 special character." }));
        hasError = true;
    } else if (inputData.newPassword === inputData.currentPassword) {
        setErrors(prev => ({ ...prev, newPassword: "New password cannot be the same as the old password." }));
        hasError = true;
    }

    if (inputData.newPassword !== inputData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "New passwords do not match." }));
      hasError = true;
    }

    if (hasError) return;

    const updated = { ...userData, password: inputData.newPassword };
    updateStorage(updated); 
    closeModal('password'); 
    setInputData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    Alert.alert("Success", "Password updated.");
  };

  const handleSignOut = async () => {
    try {
        await AsyncStorage.removeItem('currentUser');
        
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], 
        });
    } catch (error) {
        console.error("Sign out error:", error);
        Alert.alert("Error", "Failed to sign out");
    }
  };

  const closeModal = (type) => {
    setErrors({});
    setModals(prev => ({...prev, [type]: false}));
    
    if(type === 'password') {
        setInputData(p => ({...p, currentPassword: '', newPassword: '', confirmPassword: ''}));
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    }
    if(type === 'username') setInputData(p => ({...p, newUsername: ''}));
    if(type === 'email') setInputData(p => ({...p, newEmail: ''}));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
            {userData.photoURI ? (
               <Image source={{ uri: userData.photoURI }} style={styles.profileImage} />
            ) : (
               <View style={[styles.profileImage, {backgroundColor: '#555'}]} />
            )}
          </TouchableOpacity>
          
          <View style={styles.usernameRow}>
            <Text style={styles.name}>{userData.username || "Guest"}</Text>
            <TouchableOpacity style={styles.editIconBtn} onPress={() => setModals(prev => ({...prev, username: true}))}>
              <EditIcon/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Account Details</Text>
          <View style={styles.card}>
            <View style={styles.credentialRow}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value} numberOfLines={1}>{userData.email}</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn} onPress={() => setModals(prev => ({...prev, email: true}))}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.credentialRow}>
              <View>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.value}>••••••••••••</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn} onPress={() => setModals(prev => ({...prev, password: true}))}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Activity</Text>
          <View style={styles.card}>
            <MenuRow label="Logs" onPress={() => navigation.navigate('Logs')} />
            <MenuRow label="Sign Out" onPress={handleSignOut} isLast={true} /> 
          </View>
        </View>

      </ScrollView>

      {/* USERNAME MODAL */}
      <Modal visible={modals.username} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Change Username</Text>
                <TextInput 
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="New Username"
                    value={inputData.newUsername}
                    onChangeText={t => {
                        setInputData(prev => ({...prev, newUsername: t}));
                        setErrors(prev => ({...prev, username: null}));
                    }}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => closeModal('username')}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleChangeUsername}><Text style={styles.confirmText}>Save</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      {/* EMAIL MODAL */}
      <Modal visible={modals.email} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Change Email</Text>
                <TextInput 
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="New Email Address"
                    value={inputData.newEmail}
                    onChangeText={t => {
                        setInputData(prev => ({...prev, newEmail: t}));
                        setErrors(prev => ({...prev, email: null}));
                    }}
                    autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => closeModal('email')}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleChangeEmail}><Text style={styles.confirmText}>Save</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={modals.password} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Change Password</Text>
                
                {/* OLD PASSWORD */}
                <View style={[styles.passwordContainer, errors.currentPassword && styles.inputError]}>
                    <TextInput 
                        style={styles.passwordInput}
                        placeholder="Old Password"
                        secureTextEntry={!showCurrentPassword}
                        value={inputData.currentPassword}
                        onChangeText={t => {
                            setInputData(prev => ({...prev, currentPassword: t}));
                            setErrors(prev => ({...prev, currentPassword: null}));
                        }}
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                        {showCurrentPassword ? <EyeClosedIcon/> : <EyeIcon/>}
                    </TouchableOpacity>
                </View>
                {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}

                {/* NEW PASSWORD */}
                <View style={[styles.passwordContainer, errors.newPassword && styles.inputError]}>
                    <TextInput 
                        style={styles.passwordInput}
                        placeholder="New Password"
                        secureTextEntry={!showNewPassword}
                        value={inputData.newPassword}
                        onChangeText={t => {
                            setInputData(prev => ({...prev, newPassword: t}));
                            setErrors(prev => ({...prev, newPassword: null}));
                        }}
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeClosedIcon/> : <EyeIcon/>}
                    </TouchableOpacity>
                </View>
                {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

                {/* CONFIRM PASSWORD */}
                <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                    <TextInput 
                        style={styles.passwordInput}
                        placeholder="Confirm New Password"
                        secureTextEntry={!showConfirmPassword}
                        value={inputData.confirmPassword}
                        onChangeText={t => {
                            setInputData(prev => ({...prev, confirmPassword: t}));
                            setErrors(prev => ({...prev, confirmPassword: null}));
                        }}
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeClosedIcon/> : <EyeIcon/>}
                    </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => closeModal('password')}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleChangePassword}><Text style={styles.confirmText}>Update</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9C2B5",
  },
  topSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  imageContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
    height: 140,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E7E6E1',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden'
  },
  profileImage: {
    height: 134,
    width: 134,
    borderRadius: 67,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },
  name: {
    fontWeight: "800",
    fontSize: 26,
    color: '#1A1A1A',
  },
  editIconBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#E7E6E1",
    borderRadius: 16,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    maxWidth: 200,
  },
  changeBtn: {
    backgroundColor: '#D6D3CC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  arrowText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#c9c2b5d9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#E7E6E1',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: "#DA7676",
    backgroundColor: "#da767626", 
  },
  errorText: {
    color: "#DA7676",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    padding: 10,
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    padding: 10,
  },
});