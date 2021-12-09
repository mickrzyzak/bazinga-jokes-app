import { StyleSheet } from 'react-native';
import * as Colors from './Colors';

const Styles = StyleSheet.create({
    container: {    
        backgroundColor: Colors.PRIMARY_COLOR,
        height: '100%',        
    },
    wrapper: {    
        width: '100%',
        alignItems: 'center',
        padding: 30,        
        flex: 1,
    },
    jokeWrapper: {        
        justifyContent: 'center',
        flex: 1,
    },
    jokeSetup: {
        color: Colors.WHITE_COLOR,
        fontSize: 32,
        lineHeight: 32,
        fontWeight: '700',
        textAlign: 'center',
    },
    jokePunchline: {
        color: Colors.SECONDARY_COLOR,
        fontSize: 32,
        lineHeight: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 25,
    },
    actionButton: {
        backgroundColor: Colors.WHITE_COLOR,        
        marginTop: 15,   
        width: '100%',
        height: 70,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: Colors.BLACK_COLOR,
        fontSize: 24,
        fontWeight: '700',
    },
    favoriteButton: {
        maxHeight: 45,
    },
    favoriteButtonWrapper: {
        height: 45,
    },
    soundButton: {
        position: 'absolute',
        padding: 10,
        top: 0,
        right: 0,
        zIndex: 1,
    },
    dailyNotificationsButton: {
        position: 'absolute',
        padding: 10,
        top: 46,
        right: 0,
        zIndex: 1,
    },
});

const favoriteButtonIcon = {
    size: 45,
    style: {
        color: Colors.SECONDARY_COLOR,
    },
}

const soundButtonIcon = {
    size: 25,
    style: {
        color: Colors.SMOKE_COLOR,
    },
}

const dailyNotificationsIcon = {
    size: 25,
    style: {
        color: Colors.SMOKE_COLOR,
    },
}

const linearGradient = {
    colors: [Colors.PRIMARY_COLOR, Colors.BLACK_COLOR],
}

export {Styles, favoriteButtonIcon, soundButtonIcon, dailyNotificationsIcon, linearGradient};