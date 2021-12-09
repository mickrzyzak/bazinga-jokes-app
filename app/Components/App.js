import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Jokes from '../Components/Jokes';
import Favorite from '../Components/Favorite';
import {tabNavigator} from '../Styles/App';

const ERROR_TEXT = 'Something went wrong.';
const JOKE_OF_THE_DAY_TEXT = 'Joke of the day';

const App = () => {     

    const jokeStack = require('../Files/jokes.json');
    const Tab = createMaterialTopTabNavigator();    

    const [jokeCurrent, setJokeCurrent] = useState({id: -1, setup: null, punchline: null});
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [storedJokesLoaded, setStoredJokesLoaded] = useState(false);

    // Initiate the daily notification receiver and load the stored data
    useEffect(() => {
        dailyNotificationReceiver();
        getStoredJokes().then(response => {
            setFavorites(response.favoriteJokes == null ? [] : response.favoriteJokes);  
            setHistory(response.historyJokes == null ? [] : response.historyJokes);
            setStoredJokesLoaded(true);
        });
    }, []);

    // Set the starting joke
    useEffect(() => {
        if(storedJokesLoaded && jokeCurrent.id === -1) {
            setJoke(null, false);
        }        
    }, [storedJokesLoaded]);

    // Store the favorites
    useEffect(() => {
        if(storedJokesLoaded) {
            storeFavoriteJokes();
        }
    }, [favorites]);

    // Store the history
    useEffect(() => {
        if(storedJokesLoaded) {
            if(history.length >= jokeStack.length) {
                setHistory([]);
            } else {
                storeHistoryJokes();
            }
        }        
    }, [history]);

    const randomJokeId = () => {
        return Math.floor(Math.random() * jokeStack[jokeStack.length - 1].id) + 1;
    }

    const setJoke = (id = null, includeHistory = true) => {
        setJokeCurrent(findJokeInStack(id === null ? randomJokeId() : id, includeHistory));          
    }

    const findJokeInStack = (id, includeHistory = true) => {
        let foundJoke = null;
        let loops = 0;
        while(foundJoke == null) {
            foundJoke = jokeStack.filter(joke => {
                if(id === joke.id && (includeHistory || !history.includes(joke.id))) return joke;
            })[0];
            if(++id > jokeStack.length) id = 1;
            if(++loops > jokeStack.length) includeHistory = true;
        }        
        return foundJoke;
    }

    const addJokeToHistory = id => {
        if(!history.includes(id)) {
            setHistory([...history, id]);  
        }        
    }

    const dailyNotificationReceiver = () => {
        PushNotification.configure({
            onNotification: function(notification) {
                setJoke(notification.data.jokeId);
                notification.finish(PushNotificationIOS.FetchResult.NoData);
                PushNotification.removeAllDeliveredNotifications();
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            requestPermissions: Platform.OS === 'ios',
        });
    }

    const scheduleDailyNotifications = () => {
        // Register a channel if it doesn't exists
        PushNotification.channelExists('bazinga-daily-jokes', function(exists) {
            if(!exists) {
                PushNotification.createChannel({
                    channelId: 'bazinga-daily-jokes',
                    channelName: 'Bazinga! - Daily jokes',
                });
            }
        });
        // Create scheduled local notifications
        PushNotification.getScheduledLocalNotifications(notifications => {
            for(let i = notifications.length + 1; i <= 100; i++) {
                // Find a joke
                let foundJoke = findJokeInStack(randomJokeId());
                // Set the date
                let date = new Date();
                date.setDate(date.getDate()+i);
                date.setHours(12);
                date.setMinutes(0);
                date.setSeconds(0);
                // Create a notification
                PushNotification.localNotificationSchedule({
                    channelId: 'bazinga-daily-jokes',                
                    smallIcon: 'ic_notification',
                    title: JOKE_OF_THE_DAY_TEXT,
                    message: foundJoke.setup.replace(/\s\s+/g, ' '),             
                    userInfo: {jokeId:foundJoke.id},
                    ignoreInForeground: true,
                    date,
                });
            }
        });
    }

    const cancelDailyNotifications = () => {
        PushNotification.cancelAllLocalNotifications();
    }

    const storeFavoriteJokes = async () => {
        try {
            await AsyncStorage.setItem('@favorite_jokes', JSON.stringify(favorites));
        } catch(e) {
            ToastAndroid.show(ERROR_TEXT, ToastAndroid.SHORT);            
        }
    }

    const storeHistoryJokes = async () => {
        try {
            await AsyncStorage.setItem('@history_jokes', JSON.stringify(history));
        } catch(e) {
            ToastAndroid.show(ERROR_TEXT, ToastAndroid.SHORT);            
        }
    }

    const getStoredJokes = async () => {
        try {
            const favoriteJokesValue = await AsyncStorage.getItem('@favorite_jokes');
            const historyJokesValue = await AsyncStorage.getItem('@history_jokes');
            return {
                favoriteJokes: favoriteJokesValue != null ? JSON.parse(favoriteJokesValue) : null,
                historyJokes: historyJokesValue != null ? JSON.parse(historyJokesValue) : null,
            }; 
        } catch(e) {
            ToastAndroid.show(ERROR_TEXT, ToastAndroid.SHORT); 
        }
    }      

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar hidden={true} />
                <Tab.Navigator {...tabNavigator}>
                    <Tab.Screen name="NEW JOKES">
                        {() => (
                            <Jokes
                                storedJokesLoaded={storedJokesLoaded}
                                jokeCurrent={jokeCurrent}  
                                setJoke={setJoke}                                                      
                                favorites={favorites}                            
                                setFavorites={setFavorites}
                                addJokeToHistory={addJokeToHistory}
                                scheduleDailyNotifications={scheduleDailyNotifications}
                                cancelDailyNotifications={cancelDailyNotifications}
                            />
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="FAVORITE">
                        {() => (
                            <Favorite
                                storedJokesLoaded={storedJokesLoaded}
                                jokeCurrent={jokeCurrent} 
                                setJoke={setJoke}
                                favorites={favorites}
                                setFavorites={setFavorites} 
                                findJokeInStack={findJokeInStack}                                                    
                            />
                        )}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
