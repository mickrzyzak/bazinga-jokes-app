import React from 'react';
import {Text, TouchableOpacity, View, FlatList, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Styles, linearGradient} from '../Styles/Favorite';

const NO_JOKES_TEXT = 'There are no jokes here yet.';
const REMOVE_CONFIRMATION_TEXT = 'Do you want to remove a joke from your favorites?';
const REMOVE_CONFIRMATION_ACCEPT_TEXT = 'Remove';
const REMOVE_CONFIRMATION_CANCEL_TEXT = 'Keep';
const REMOVE_INSTRUCTION_TEXT = 'Press and hold to remove';

const Favorite = props => { 

    const navigation = useNavigation();

    const setJoke = id => {
        props.setJoke(id);
        navigation.navigate('NEW JOKES');
    }

    const removeJokeFromFavorite = id => {        
        Alert.alert(
            '',
            REMOVE_CONFIRMATION_TEXT,
            [
                {
                    text: REMOVE_CONFIRMATION_ACCEPT_TEXT,
                    onPress: () => {
                        props.setFavorites(props.favorites.filter(jokeId => {
                            return jokeId != id;
                        }));
                    }
                },
                {
                    text: REMOVE_CONFIRMATION_CANCEL_TEXT
                }
            ]
        );
    }

    const renderItem = ({item}) => {
        let joke = props.findJokeInStack(item);
        return (
            <TouchableOpacity
                onPress={() => setJoke(joke.id)}
                onLongPress={() => removeJokeFromFavorite(joke.id)}
                activeOpacity={0.8}
                style={Styles.listButton}
            >
                <Text style={Styles.listButtonText}>{joke.setup.replace(/\s\s+/g, ' ')}</Text>
            </TouchableOpacity>
        ); 
    }

    const List = () => {
        return (
            <View style={Styles.listWrapper}>
                <Text style={Styles.removeInfoText}>{REMOVE_INSTRUCTION_TEXT}</Text>
                <FlatList
                    data={[...props.favorites].reverse()}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                />
            </View>
        );
    }

    const NoJokes = () => {
        return (
            <Text style={Styles.noJokesText}>{NO_JOKES_TEXT}</Text>
        );
    }

    return (
        <SafeAreaView>            
            <View style={Styles.container}>
                <LinearGradient {...linearGradient} style={Styles.wrapper}>
                    {
                    props.storedJokesLoaded ?
                        props.favorites != null && props.favorites.length > 0 ? <List /> : <NoJokes />
                        : null
                    }
                </LinearGradient>
            </View>            
        </SafeAreaView>
    );
};

export default Favorite;
