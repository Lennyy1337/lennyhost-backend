import db from '@/adapters/db';

import { id } from '@/utils/id';
import { logger } from '@/utils/logger';
import { jwt } from '@/utils/jwt';
import { HttpException } from '@/utils/http';

class SharedServiceBase {
    public readonly db: typeof db;
    public readonly id: typeof id;
    public readonly log: typeof logger;
    public readonly jwt: typeof jwt;
    public readonly httpException: typeof HttpException;

    constructor() {
        this.db = db;
        this.id = id;
        this.log = logger;
        this.jwt = jwt;
        this.httpException = HttpException;
    }
}

export default SharedServiceBase;
