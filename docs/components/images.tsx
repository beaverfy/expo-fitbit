import Image, { ImageProps } from "next/image";

export function NativeImage(props: { size: number; } & ImageProps) {
    return (
        <img src="/expo-fitbit-banner.png" width={props.size} height={props.size} alt={props.alt} className={props.className} />
    )
}

export function Banner(props: { className: string; size: number; alt: string; }) {
    return (
        <img src="/expo-fitbit-banner.png" width={props.size} height={props.size} alt={props.alt} className={props.className} />
    )
}

export function Icon(props: { className: string; size: number; alt: string; }) {
    return (
        <img src="/expo-fitbit.png" width={props.size} height={props.size} alt={props.alt} className={props.className} />
    )
}