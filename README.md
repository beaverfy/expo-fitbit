<img src="https://raw.githubusercontent.com/beaverfy/expo-fitbit/main/expo-fitbit.png" alt="Expo Fitbit by beaverfy" width="100%">

# @beaverfy/expo-fitbit
Add fitbit authentication to your expo managed react native apps

## Getting Started
### Installation
#### Using yarn
```shell
yarn add @beaverfy/expo-fitbit
```
#### Using NPM
```shell
npm install @beaverfy/expo-fitbit
```

### Getting Credentials
Register an app on [dev.fitbit.com](https://dev.fitbit.com/apps/new), fill out your app details and select client, since we'll be using the credentials in our app

Once you've created your app, edit your app to have the redirect url: `scheme://fitbit` (replacing scheme with your app's scheme)

### Intergrating into your project
> We're still working on this section

Wrap your app in `FitbitProvider`:
```tsx
import { FitbitProvider } from "@beaverfy/expo-fitbit";
import Constants from "expo-constants";
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV({
    id: `authentication`,
    encryptionKey: 'random-password'
});

<FitbitProvider configuration={{
    clientId: "CLIENT_ID",
    clientSecret: "CLIENT_SECRET",
    appScheme: Constants.expoConfig.scheme,
    scopes: ["profile"],
    storage: {
        get: (key) => storage.getString(key),
        set: (key, value) => storage.set(key, value)
    },
    onLogin(user) => console.log("User logged in:", user);
}}>
    {/* app code... */}
</FitbitProvider>
```

Get the user's profile data with the `useFitbit` hook:
```tsx
const {
    userData,
    isLoading,
    isLoggedIn
} = useFitbit();

return <Text>Logged in as: {userData?.name}</Text>
```
