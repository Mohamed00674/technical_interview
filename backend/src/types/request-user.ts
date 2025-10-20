import { Request } from 'express';

import { UserRole } from '../modules/user/user.model';

export type ExpressRequestWithAuth = Request & {
    user?: {
        id: string;
        roles: UserRole[];
    };
};