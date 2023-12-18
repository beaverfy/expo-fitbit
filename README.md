![@beaverfy/expo-fitbit (image)](./expo-fitbit.png)
<img src="https://user-images.githubusercontent.com/16062886/117443145-ff868480-af37-11eb-8680-648bccf0d0ce.png" alt="Expo Fitbit by beaverfy" width="100%">
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

<FitbitProvider>
    {/* app code... */}
</FitbitProvider>
```

Get the user's profile data with the `useFitbit` hook:
```tsx
const {} = useFitbit();
```
