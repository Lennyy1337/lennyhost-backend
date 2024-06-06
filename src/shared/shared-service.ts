import db from '@/adapters/db';

import { id } from '@/utils/id';
import { logger } from '@/utils/logger';
import { jwt } from '@/utils/jwt';
import { HttpException } from '@/utils/http';
import { transporter } from '@/utils/nodemailer';
import { s3 } from '@/utils/s3';

class SharedServiceBase {
    public readonly db: typeof db;
    public readonly id: typeof id;
    public readonly log: typeof logger;
    public readonly jwt: typeof jwt;
    public readonly transporter: typeof transporter;
    public readonly s3: typeof s3;
    public readonly httpException: typeof HttpException;

    constructor() {
        this.db = db;
        this.id = id;
        this.log = logger;
        this.jwt = jwt;
        this.transporter = transporter;
        this.s3 = s3;
        this.httpException = HttpException;
    }
}

export default SharedServiceBase;
