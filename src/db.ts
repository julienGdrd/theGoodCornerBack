import { DataSource } from 'typeorm'
import { AdEntity } from './entities/ad'


export default new DataSource({
    type: 'sqlite',
    database: '../good_corner.sqlite',
    entities: [AdEntity],
    synchronize: true,
    logging: true,
});