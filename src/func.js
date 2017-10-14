import { union, without } from 'lodash/array'
import { omit } from 'lodash/object'
import { isPlainObject } from 'lodash/lang'

export default {
  upsert: (norm, entityOrEntities) => {
    const isSingle = isPlainObject(entityOrEntities)

    if (isSingle) {
      return {
        ids: union(norm.ids, [entityOrEntities.id]),
        data: {
          ...norm.data,
          [entityOrEntities.id]: entityOrEntities
        }
      }
    }

    return {
      ids: union(norm.ids, entityOrEntities.map(({ id }) => id)),
      data: {
        ...norm.data,
        ...arrayToMap(entityOrEntities)
      }
    }
  },
  fromArray: array =>
    array.reduce(
      (acc, entity) => ({
        ids: union(acc.ids, [entity.id]),
        data: {
          ...acc.data,
          [entity.id]: entity
        }
      }),
      {
        ids: [],
        data: {}
      }
    ),
  toArray: (arg1, arg2) => {
    const { ids, data } = arg2 ? { ids: arg1, data: arg2 } : arg1
    if (!ids || !data) {
      throw Error('Normalized.toArray: argument error')
    }
    return ids.map(id => data[id])
  },
  remove: (norm, entityIdOrIds) => ({
    ids: without(norm.ids, entityIdOrIds),
    data: omit(norm.data, entityIdOrIds)
  }),
  pickFrom: (norm, ids) => ({
    ids,
    data: mapPickIds(ids, norm.data)
  }),
  create: () => ({
    ids: [],
    data: {}
  })
}

const mapPickIds = (ids, map) =>
  ids.reduce(
    (acc, id) => ({
      ...acc,
      [id]: map[id]
    }),
    {}
  )

const arrayToMap = array =>
  array.reduce(
    (acc, entity) => ({
      ...acc,
      [entity.id]: entity
    }),
    {}
  )
