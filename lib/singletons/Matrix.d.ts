import { IMatrix } from '../interface/ISMatrix';
export declare class Matrix implements IMatrix {
    private constructor();
    static instance: Matrix;
    static getInstance(): Matrix;
    private mat;
    private hasNext;
    init(size: number): this;
    merge(method: 'left' | 'right' | 'up' | 'down'): number[][];
    addRand(times?: number): boolean;
    private mergeLeft;
    private mergeRight;
}
