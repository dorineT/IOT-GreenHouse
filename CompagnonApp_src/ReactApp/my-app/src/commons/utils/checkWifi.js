import NetInfo from '@react-native-community/netinfo';

export function wifi(){    
    NetInfo.fetch().then(state => {      
      if(state.type!=="wifi" || !state.isConnected){
        alert("Veuillez allumer votre wifi et vous connecter sur \"Serre\"")
      }    
      else if(state.details.ssid !== "Serre"){
        alert("Attention, vous n'etes pas connecté sur le wifi \"Serre\"")
      }
    });

  }