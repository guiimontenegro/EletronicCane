import {StyleSheet} from "react-native";

const css = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    map:{
        height: '70%'
    },
    search:{
        height: '30%',
        backgroundColor:'lightblue'
    },
    distance:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        padding: 10
    },
    distance__text:{
        fontSize:20,
        fontWeight:'bold'
    },
    price:{
        backgroundColor: '#000',
        padding: 7,
        borderRadius:4,
        marginTop:30,
        justifyContent:'center',
        alignItems: 'center'
    },
    price__text:{
        color:'#fff',
        fontWeight: 'bold',
        fontSize: 20
    }
});
export {css};