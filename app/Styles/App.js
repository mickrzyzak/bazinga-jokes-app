import * as Colors from './Colors';

const tabNavigator = {
    tabBarOptions: {
        activeTintColor: Colors.SECONDARY_COLOR,
        inactiveTintColor: Colors.BLACK_COLOR,
        pressColor: 'transparent',
        labelStyle: {
            fontSize: 14,
            fontWeight: '700',
        },
        indicatorStyle: {
            height: 55,
            backgroundColor: Colors.PRIMARY_COLOR,
        },
        tabStyle: {
            height: 55,
        },
        style: {
            elevation: 0,
        }
    },
    sceneContainerStyle: {
        backgroundColor: Colors.PRIMARY_COLOR,
    },
}

export {tabNavigator};