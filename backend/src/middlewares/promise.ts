import { Response } from 'express';

import { ExpressRequestWithAuth } from '../types/request-user';
import { handleCatch } from './errorHandler';

interface WithTryCatchRoutePromiseOptions {
    /**
     * @default true
     */
    returnResultAsData?: boolean;
    /**
     * @default 'Promise successfully processed'
     */
    successMessage?: string;
    /**
     * @default false
     */
    showSuccessMessage?: boolean;
}

const defaultHandleTryCatchRoutePromise = {
    returnResultAsData: true,
    successMessage: 'Promise successfully processed',
    showSuccessMessage: false,
} satisfies WithTryCatchRoutePromiseOptions;

export function withTryCatchRoutePromise<PromiseReturn = any>(
    promiseFunction: (
        req: ExpressRequestWithAuth,
        res: Response,
    ) => Promise<PromiseReturn>,
    {
        returnResultAsData = defaultHandleTryCatchRoutePromise.returnResultAsData,
        successMessage = defaultHandleTryCatchRoutePromise.successMessage,
        showSuccessMessage = defaultHandleTryCatchRoutePromise.showSuccessMessage,
    }: WithTryCatchRoutePromiseOptions = defaultHandleTryCatchRoutePromise,
) {
    return async (req: ExpressRequestWithAuth, res: Response) => {
        try {
            const promiseResult = await promiseFunction(req, res);

            res.status(200).json({
                success: true,
                ...(showSuccessMessage ? { message: successMessage } : {}),
                data: returnResultAsData ? promiseResult : null,
            });
        } catch (err) {
            const appError = handleCatch(err);

            res.status(appError.statusCode).json({
                success: false,
                error: appError.type,
                message: appError.message,
            });
        }
    };
}
