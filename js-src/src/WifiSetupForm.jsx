import React from 'react';
import GenericForm from './GenericForm';

class WifiForm extends React.Component {
  render() {
    const { onGoBack } = this.props;

    const wifiFormSchema = {
      "fields": [
        { "label": "SSID AP", "name": "ssid_AP", "type": "text", "required": true },
        { "label": "Password AP", "name": "password_AP", "type": "password", "required": false },
        { "label": "SSID Router", "name": "ssid_Router", "type": "text", "required": false },
        { "label": "Password Router", "name": "password_Router", "type": "password", "required": false },
        { "label": "IP Address", "name": "ipAddr", "type": "text", "required": true }
      ]
    };

    var urlString = 'http://' + window.location.hostname;

    if(import.meta.env.VITE_APP_WIFI_CONFIG_DEFAULT_HOST !== undefined)
      urlString = import.meta.env.VITE_APP_WIFI_CONFIG_DEFAULT_HOST;
  
    urlString += "/wifisetup";

    return (
      <GenericForm schema={wifiFormSchema} apiUrl={urlString} onGoBack={onGoBack} />
    );
  }
}

export default WifiForm;
