import * as express from 'express';

export const webServer = (app: express.Express, port: number) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
}
