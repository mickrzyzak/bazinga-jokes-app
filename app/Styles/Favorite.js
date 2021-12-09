import { StyleSheet } from 'react-native';
import * as Colors from './Colors';

const Styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.PRIMARY_COLOR,
    },
    wrapper: {
        height: '100%',
    },
    listWrapper: {
        height: '100%',
    },
    listButton: {        
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: Colors.SMOKE_COLOR+'26',
    },
    listButtonText: {
        color: Colors.WHITE_COLOR,
        fontSize: 15,
        lineHeight: 15,
    },
    noJokesText: {
        padding: 30,
        fontSize: 15,        
        color: Colors.WHITE_COLOR,        
        textAlign: 'center',
    },
    removeInfoText: {
        color: Colors.SMOKE_COLOR,
        textAlign: 'center',
        fontSize: 10,
        marginVertical: 15,
        opacity: 0.5,
    },
});

const linearGradient = {
    colors: [Colors.PRIMARY_COLOR, Colors.BLACK_COLOR],
}

export {Styles, linearGradient};