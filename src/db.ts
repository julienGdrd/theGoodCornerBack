import { DataSource } from 'typeorm'
import { Ad } from './entities/ad'
import { Category } from './entities/category';


export default new DataSource({
    type: 'sqlite',
    database: 'the_good_corner.sqlite',
    entities: ["src/entities/*.ts"],
    synchronize: true,
    logging: true,
});