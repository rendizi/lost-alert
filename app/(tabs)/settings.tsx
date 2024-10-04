import { Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInformation {
  name: string;
  rank: string;
  phoneNumber: string;
  city: string;
}

export default function TabTwoScreen() {
  const [userData, setUserData] = useState<UserInformation | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState<number>(1); // Step for the verification process

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    checkUserData();
  }, []);

  const handleLogin = async () => {
    if (phoneNumber.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/user/data/${phoneNumber}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          let userData;
          if (response.body) {
            try {
              userData = await response.json();
              await AsyncStorage.setItem('user', JSON.stringify(userData));
              setUserData(userData)
            } catch (err) {
              console.error(err);
            }
          }
          if (userData) {
            setStep(3); // Go to password input step
          } else {
            await fetch('http://localhost:3000/user/verify', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phoneNumber }),
            });
            setStep(2); // Go to code input step
          }
        } else {
          console.error('Error fetching user data:', response.status);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const handleLoginWithPassword = async () => {
    if (password.trim()) {
      try {
        // Mock the login response
        const loginResponse = {
          ok: true,
          json: async () => ({
            name: 'John Doe',
            rank: 'Gold',
            phoneNumber,
            city: 'Sample City',
          }),
        };

        if (loginResponse.ok) {
          const userData = await loginResponse.json();
          setIsLoggedIn(true);
        } else {
          console.error('Error during login:', loginResponse);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const handleVerifyCode = async () => {
    if (code.trim()) {
      try {
        // Mock the verification response
        const verifyResponse = {
          ok: true,
          json: async () => ({
            phoneNumber,
          }),
        };

        if (verifyResponse.ok) {
          const userData = await verifyResponse.json();
          setStep(4); // Go to name and password input step
        } else {
          console.error('Error verifying code:', verifyResponse);
        }
      } catch (error) {
        console.error('Error verifying code:', error);
      }
    }
  };

  const handleSignUp = async () => {
    if (name.trim() && password.trim()) {
      try {
        // Mock the sign-up response
        const signUpResponse = {
          ok: true,
          json: async () => ({
            name,
            rank: 'Bronze',
            phoneNumber,
            city: 'Sample City',
          }),
        };

        if (signUpResponse.ok) {
          const userData = await signUpResponse.json();
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUserData(userData);
          setIsLoggedIn(true);
        } else {
          console.error('Error during signup:', signUpResponse);
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUserData(null);
      setIsLoggedIn(false);
      setStep(1); // Reset step to login
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>User Information</Text>

        {isLoggedIn && userData && (
          <>
            <View style={styles.rankContainer}>
              <Icon name="trophy" size={24} color="#FFD700" />
              <Text style={styles.rankText}>Rank: {userData.rank}</Text>
            </View>

            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{userData.name}</Text>

            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.info}>{userData.phoneNumber}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.info}>{userData.city}</Text>
          </>
        )}

        {step === 1 && !isLoggedIn && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Send Verification Code</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleVerifyCode}>
              <Text style={styles.loginText}>Verify Code</Text>
            </TouchableOpacity>
          </>
        )}

        {!isLoggedIn && step === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginWithPassword}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 4 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#888',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    marginLeft: 10,
    fontSize: 18,
  },
});
