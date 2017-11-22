import { union, without } from 'lodash/array'
import { omit } from 'lodash/object'
import { isPlainObject } from 'lodash/lang'

export default {
  upsert: (norm, entityOrEntities, { merge } = {}) => {
    const isSingle = isPlainObject(entityOrEntities)

    if (isSingle) {
      const entity = entityOrEntities

      return {
        ids: union(norm.ids, [entity.id]),
        data: {
          ...norm.data,
          [entity.id]: merge ? mergeIntoExisting(norm, entity) : entity
        }
      }
    }

    const entities = merge
      ? entityOrEntities.map(entity => mergeIntoExisting(norm, entity))
      : entityOrEntities

    return {
      ids: union(norm.ids, entities.map(({ id }) => id)),
      data: {
        ...norm.data,
        ...arrayToMap(entities)
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
      console.warn('Normalized.toArray: argument error')
      return []
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

const mergeIntoExisting = (norm, item) =>
  Object.assign({}, norm.data[item.id] || {}, item)

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
