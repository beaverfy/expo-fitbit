<img src="./images/expo-fitbit.png" alt="Expo Fitbit by beaverfy" width="100%">

# @beaverfy/expo-fitbit
`@beaverfy/expo-fitbit` adds fitbit authentication to your expo-managed react native apps

### Why use `@beaverfy/expo-fitbit`?
- Easy intergration to your project

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
#### Wrap your app in `FitbitProvider`:
```tsx
<FitbitProvider configuration={{
    //...
}}>
    {/* app code... */}
</FitbitProvider>
```
#### Get the current user
```tsx
const {
    userData,
    isLoading,
    isLoggedIn
} = useFitbitProvider();
```
### Working example
```tsx
//app.tsx
import { FitbitProvider } from "@beaverfy/expo-fitbit";
import Constants from "expo-constants";
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV({
    id: `authentication`,
    encryptionKey: 'random-password'
});

export default function App(){
    return (
        <FitbitProvider configuration={{
            clientId: "CLIENT_ID",
            clientSecret: "CLIENT_SECRET",
            appScheme: Constants.expoConfig.scheme,
            scopes: ["profile"],
            storage: {
                get: (key) => storage.getString(key),
                set: (key, value) => storage.set(key, value)
            },
            onLogin(user) => console.log("User logged in:",    user);
        }}>
            {/* app code... */}
        </FitbitProvider>
    );
}
```
```tsx
//home.tsx
import { useFitbitProvider } from "@beaverfy/expo-fitbit";

export default function Home(){
    const {
        userData,
        isLoading,
        isLoggedIn
    } = useFitbit();

    return <Text>Logged in as: {userData?.name}</Text>
}
```
