// Change this to your local IP address;
const localIp = "192.168.1.11:3000";

export default async function fetchCanteens() {
    return fetch(`http://${localIp}/api/canteens`)
      .then(response => response.json());
}