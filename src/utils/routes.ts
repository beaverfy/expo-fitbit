export function DateString(d: Date) {
    const getMonth = () => d.getMonth() + 1;
    return `${d.getFullYear()}-${getMonth().toString().length == 2 ? getMonth() : `0${getMonth()}`}-${d.getDate().toString().length == 2 ? d.getDate() : `0${d.getDate()}`}`
}

export const Routes = {
    Profile: () => "https://api.fitbit.com/1/user/-/profile.json",
    Activity: (date?: Date) => {
        const d = date ?? new Date();
        return `https://api.fitbit.com/1/user/-/activities/date/${DateString(d)}.json`
    },
    ActiveMinutes: (date?: Date) => {
        const d = date ?? new Date();
        return `https://api.fitbit.com/1/user/-/activities/active-zone-minutes/date/${DateString(d)}/1d.json`
    },
    Token: () => `https://api.fitbit.com/oauth2/token`
}