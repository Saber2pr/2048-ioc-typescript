export interface IMatrix {
    init(size: number, maxValue?: number): this;
    merge(method: 'left' | 'right' | 'up' | 'down', arr?: number[][]): number[][];
    addRand(times?: number): boolean;
}
