export function DateString(d) {
    const getMonth = () => d.getMonth() + 1;
    return `${d.getFullYear()}-${getMonth().toString().length == 2 ? getMonth() : `0${getMonth()}`}-${d.getDate().toString().length == 2 ? d.getDate() : `0${d.getDate()}`}`;
}
export const Routes = {
    Profile: () => "https://api.fitbit.com/1/user/-/profile.json",
    Activity: (date) => {
        const d = date ?? new Date();
        return `https://api.fitbit.com/1/user/-/activities/date/${DateString(d)}.json`;
    },
    ActiveMinutes: (date) => {
        const d = date ?? new Date();
        return `https://api.fitbit.com/1/user/-/activities/active-zone-minutes/date/${DateString(d)}/1d.json`;
    },
    Token: () => `https://api.fitbit.com/oauth2/token`
};
//# sourceMappingURL=routes.js.map