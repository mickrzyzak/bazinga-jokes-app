import React, {useEffect, useRef, useState } from 'react';
import {Animated, Text, TouchableOpacity, View, ScrollView, Vibration, ToastAndroid} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Styles, favoriteButtonIcon, soundButtonIcon, dailyNotificationsIcon, linearGradient} from '../Styles/Jokes';

const TELL_ME_TEXT = 'TELL ME';
const ANOTHER_JOKE_TEXT = 'ANOTHER JOKE';

const Jokes = props => { 

    const baDubTssSound = useRef(new Sound('ba_dum_tss.mp3', Sound.MAIN_BUNDLE)).current;
    const favoriteButtonAnim = useRef(new Animated.Value(0)).current;

    const [jokeDisplay, setJokeDisplay] = useState({setup: '', punchline: ''});
    const [jokePunchlineShow, setJokePunchlineShow] = useState(false);
    const [jokeIsFavorite, setJokeIsFavorite] = useState(false);
    const [sound, setSound] = useState(true);
    const [dailyNotifications, setDailyNotifications] = useState(true);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Set the settings from the store
    useEffect(() => {
        getSettings().then(response => {
            if(response === null) {
                setSound(true);
                setDailyNotifications(true);
            } else {
                setSound(response.sound);
                setDailyNotifications(response.dailyNotifications);
            }
            setSettingsLoaded(true);     
        });
    }, []);

    // Set the configuration of a new joke 
    useEffect(() => {
        setJokeDisplay(props.jokeCurrent);
        setJokePunchlineShow(false);
        setJokeIsFavorite(props.favorites.includes(props.jokeCurrent.id));
    }, [props.jokeCurrent]);

    // Set favorite status of the current joke 
    useEffect(() => {
        if(props.favorites != null) {
            setJokeIsFavorite(props.favorites.includes(props.jokeCurrent.id));
        }
    }, [props.favorites]);

    // Fire favorite animation when punchline of a joke is displayed
    useEffect(() => {
        if(jokePunchlineShow === true) {
            favoriteButtonAnimFire();
        }        
    }, [jokePunchlineShow]);

    // Store the settings
    useEffect(() => {
        if(settingsLoaded) {
            storeSettings();
        }        
    }, [sound, dailyNotifications]);

    // Create or cancel scheduled notifications
    useEffect(() => {
        if(settingsLoaded) {
            if(dailyNotifications) {
                props.scheduleDailyNotifications();
            } else {
                props.cancelDailyNotifications();            
            }
        } 
    }, [dailyNotifications, settingsLoaded]);

    const favoriteButtonAnimFire = () => {
        Animated.timing(favoriteButtonAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            favoriteButtonAnim.setValue(0);
        });
    }

    const showPunchline = () => {
        props.addJokeToHistory(props.jokeCurrent.id);  
        setJokePunchlineShow(true);        
        Vibration.vibrate(100);
        if(sound) {
            baDubTssSound.stop(() => {
                baDubTssSound.play();
            });
        }
    }

    const anotherJoke = () => {
        props.setJoke(null, false);
    }

    const addJokeToFavorites = () => {     
        favoriteButtonAnimFire();   
        if(!jokeIsFavorite) {
            setJokeIsFavorite(true);            
            props.setFavorites([...props.favorites, props.jokeCurrent.id]);
        } else {
            setJokeIsFavorite(false);
            props.setFavorites(props.favorites.filter(jokeId => {
                return jokeId != props.jokeCurrent.id;
            }));
        }
    }

    const storeSettings = async () => {
        try {
            await AsyncStorage.setItem('@settings', JSON.stringify({sound, dailyNotifications}));
        } catch(e) {
            ToastAndroid.show(ERROR_TEXT, ToastAndroid.SHORT);            
        }
    }

    const getSettings = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@settings');            
            return jsonValue != null ? JSON.parse(jsonValue) : null;  
        } catch(e) {
            ToastAndroid.show(ERROR_TEXT, ToastAndroid.SHORT); 
        }
    }

    const TellMeButton = () => {  
        return (
            <TouchableOpacity onPress={showPunchline} style={Styles.actionButton} activeOpacity={0.8}>
                <Text style={Styles.actionButtonText}>{TELL_ME_TEXT}</Text>        
            </TouchableOpacity>
        );
    }

    const AnotherJokeButton = () => {  
        return (
            <TouchableOpacity onPress={anotherJoke} style={Styles.actionButton} activeOpacity={0.8}>
                <Text style={Styles.actionButtonText}>{ANOTHER_JOKE_TEXT}</Text>          
            </TouchableOpacity>
        );
    }

    const FavoriteButton = () => {  
        return (
            <Animated.View style={{transform: [{
                scale: favoriteButtonAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.25, 1],
                }),
            }]}}>
                <TouchableOpacity onPress={addJokeToFavorites} style={Styles.favoriteButton} activeOpacity={0.8}>
                    <Icon
                        name={jokeIsFavorite ? 'favorite' : 'favorite-border'}
                        {...favoriteButtonIcon}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }

    const MuteButton = () => {  
        return (
            <TouchableOpacity onPress={() => setSound(!sound)} style={Styles.soundButton} activeOpacity={0.8}>
                <Icon
                    name={sound ? 'volume-up' : 'volume-off'}
                    {...soundButtonIcon}
                />
            </TouchableOpacity>
        );
    }

    const NotificationButton = () => {  
        return (
            <TouchableOpacity onPress={() => setDailyNotifications(!dailyNotifications)} style={Styles.dailyNotificationsButton} activeOpacity={0.8}>
                <Icon
                    name={dailyNotifications ? 'notifications' : 'notifications-off'}
                    {...dailyNotificationsIcon}
                />
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={Styles.container}>
                <LinearGradient {...linearGradient} style={Styles.wrapper}>
                    {
                    settingsLoaded ?
                        <>
                            <MuteButton />
                            <NotificationButton />
                        </>
                        : null
                    }
                    <View style={Styles.jokeWrapper}>
                        <Text style={Styles.jokeSetup}>{jokeDisplay.setup}</Text>
                        <Text style={[{opacity: jokePunchlineShow ? 1 : 0}, Styles.jokePunchline]}>{jokeDisplay.punchline}</Text>
                    </View>
                    <View style={Styles.favoriteButtonWrapper}>
                        {jokePunchlineShow ? <FavoriteButton /> : null }
                    </View>
                    {
                    props.storedJokesLoaded ?
                        jokePunchlineShow ? <AnotherJokeButton /> : <TellMeButton />
                        : null
                    } 
                </LinearGradient>            
            </ScrollView>            
        </SafeAreaView>
    );
};

export default Jokes;
