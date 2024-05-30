export default function roundToNthDecimalPlace(x: number, n: number): number {
    const scaleFactor = Math.pow(10, n);
    return Math.round(x * scaleFactor) / scaleFactor;
}