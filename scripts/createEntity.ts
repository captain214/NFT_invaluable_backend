import { Connection, createConnection } from 'typeorm';
import { Collection } from "../src/modules/collections/entities/collection.entity";
import { Category } from "../src/modules/collections/entities/category.entity";
import { lorem, vehicle, date, datatype, finance, internet } from 'faker';
import { Asset } from "../src/modules/asset/entities/asset.entity";
import { AssetType } from "../src/common/constants/asset-type.enum";
import { EventLog } from "../src/modules/events/entities/event.entity";
import { EventType } from '../src/common/constants/event-type.enum';
import { Order } from '../src/modules/orders/entities/order.entity';
import { OrderType } from '../src/common/constants/order-type.enum';
import { OrderStatus } from '../src/common/constants/order-status.enum';
import { OrderSide } from '../src/common/constants/order-side.enum';

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 0
});
let connection: Connection;

const ask = (question: string, suggestions?: string[]): Promise<string> => {
  let suggestionPointer = -1;
  const suggestionStr = suggestions?.length > 1 ? ' [' + suggestions.join(', ') + ']' : '';
  const questionStr = `${question}${suggestionStr}: `;
  const handleArrowKeys = async (_, key) => {
    if (key.name === 'up') {
      suggestionPointer = suggestionPointer + 1 >= suggestions.length ? 0 : suggestionPointer + 1;
      rl.write(null, { ctrl: true, name: 'u' });
      rl.write(suggestions[suggestionPointer]);
    }
    if (key.name === 'down') {
      suggestionPointer = suggestionPointer - 1 < 0 ? suggestions.length - 1 : suggestionPointer - 1;
      rl.write(null, { ctrl: true, name: 'u' });
      rl.write(suggestions[suggestionPointer]);
    }
  };
  if (suggestions?.length > 0) {
    process.stdin.on('keypress', handleArrowKeys);
  }
  return new Promise(resolve => {
    rl.setPrompt(questionStr);
    rl.prompt();
    rl.once('line', (line) => {
      process.stdin.off('keypress', handleArrowKeys);
      resolve(line);
    })
  });
}
const randomColor = () => Math.floor(Math.random()*16777215).toString(16);
const randomImage = (text = '', width = 500, height = 500) => {
  return `https://placehold.co/${width}x${height}/${randomColor()}/${randomColor()}?text=${text}`;
};
const randomNumber = (max: number, min = 1) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

const stringToEntity = {
  category: Category,
  collection: Collection,
  asset: Asset,
  event: EventLog,
  order: Order
}

const entityMap = {
  event: () => ({
    asset: { repository: Asset, getter: (val: Asset) => val.title },
    type: Object.values(EventType),
    from_account: internet.userName(),
    to_account: internet.userName(),
    created_at: new Date().toISOString(),
    price: randomNumber(100) + '0000000000000000'
  }),
  category: () => ({
    title: vehicle.model(),
    image_url: randomImage()
  }),
  collection: () => {
    const name = lorem.word();
    return {
      name,
      slug: lorem.slug(),
      description: lorem.sentences(2),
      image_url: randomImage(name),
      banner_url: randomImage(name, 900, 300),
      category: {repository: Category, getter: (val: Category) => val.title},
      created_at: new Date().toISOString()
    }
  },
  asset: () => {
    const title = lorem.words(2);
    return {
      token_id: datatype.number(),
      address: finance.ethereumAddress(),
      title,
      description: lorem.sentence(),
      image_url: randomImage(title),
      creator: internet.userName(),
      owner: internet.userName(),
      chain_id: datatype.number(8),
      favorites_count: datatype.number(100),
      collection: {repository: Collection, getter: (val: Collection) => val.name},
      role: Object.values(AssetType),
      properties: ''
    }
  },
  order: () => ({
    asset: { repository: Asset, getter: (val: Asset) => val.title },
    price: randomNumber(100) + '0000000000000000',
    expiration_time: date.soon(5).toISOString(),
    creator: internet.userName(),
    type: Object.values(OrderType),
    status: Object.values(OrderStatus),
    side: Object.values(OrderSide),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
}

const processEntityEdit = async (entity: Object): Promise<Object> => {
  const keys = Object.keys(entity);
  const output = {};
  for (const k of keys) {

    // if array of values
    if (Array.isArray(entity[k])) {
      const first = entity[k].find(Boolean);
      let newValue = await ask(`${k} (${first})`, entity[k]);
      newValue = newValue === 'null' ? null : newValue;
      output[k] = newValue || first;

    // if relation object
    } else if (typeof entity[k] === 'object') {
      const { repository, getter } = entity[k];
      const list = await connection
        .getRepository<any>(repository)
        .createQueryBuilder('entity')
        .getMany();
      let outputEntity = list.find(Boolean);
      const options = list.map(i => getter(i));
      let newValue = await ask(`${k} (${getter(outputEntity)})`, options);
      newValue = newValue === 'null' ? null : newValue;
      if (newValue !== '') {
        outputEntity = list.find(i => getter(i) === newValue);
      }
      output[k] = outputEntity.id;

    // if string
    } else {
      let newValue = await ask(`${k} (${entity[k]})`, [entity[k]]);
      newValue = newValue === 'null' ? null : newValue;
      if (newValue !== '') output[k] = newValue;
    }
  }
  return output;
}

const createEntity = async () => {
  const entityKeys = Object.keys(stringToEntity);
  const entityName = await ask(`Enter entity name`, entityKeys);
  const quantity = Number(await ask(`Enter quantity`));
  const entityCreator = entityMap[entityName];
  if (!entityCreator) {
    console.log('Entity not found!');
    return;
  }
  for (let i = 0; i < quantity; i++) {
    const entity = entityCreator();
    const edit = await processEntityEdit(entity);
    await connection
      .getRepository(stringToEntity[entityName])
      .createQueryBuilder('entity')
      .insert()
      .values({ ...entity, ...edit })
      .execute();
    console.log(`--- Entity '${entityName}' created successfully! (${i + 1}/${quantity}) ---`)
  }
}

const init = async () => {
  connection = await createConnection();
  let isRunning = true;
  while (isRunning) {
    await createEntity();
    const continueAnswer = await ask('Create another entry? (Y/n)');
    if (continueAnswer.toLowerCase() === 'n') {
      isRunning = false;
    }
  }
}

init()
  .then(() => {
    console.log('script end');
    process.exit();
  })
  .catch((e) => {
    console.log('script failed', e);
    process.exit();
  });
