import '@openint/app-config/register.node'
import {contextFactory} from '@openint/app-config/backendConfig'
import type {EndUserId} from '@openint/cdk'
import {flatRouter} from '@openint/engine-backend'
import {inngest} from '@openint/engine-backend/events'
import {getPool, sql} from '../lib-server'
import * as routines from './routines'

export const scheduleSyncs = inngest.createFunction(
  {id: 'Schedule pipeline syncs'},
  // Disable scheduling during development, can be explicitly triggered from /api/inngest UI
  process.env.NODE_ENV === 'development'
    ? {event: 'sync/scheduler-debug'}
    : {cron: '0 * * * *'}, // Once an hour, https://crontab.guru/#0_*_*_*_*
  routines.scheduleSyncs,
)

export const syncPipeline = inngest.createFunction(
  {id: 'Sync pipeline'},
  {event: 'sync/pipeline-requested'},
  routines.syncPipeline,
)

export const syncResource = inngest.createFunction(
  {id: 'Sync resource'},
  {event: 'sync/resource-requested'},
  async ({event}) => {
    try {
      const {resourceId} = event.data
      console.log('Will sync resource', resourceId)
      // TODO: Figure out what is the userId we ought to be using...

      const pool = await getPool()
      const endUserId = await pool.oneFirst<EndUserId>(
        sql`SELECT end_user_id FROM resource WHERE id = ${resourceId}`,
      )
      console.log('endUserId', endUserId)
      await flatRouter
        .createCaller({
          ...contextFactory.fromViewer({role: 'system'}),
          remoteResourceId: null,
        })
        .syncResource({id: resourceId})

      console.log('did sync pipeline', resourceId)
      return resourceId
    } catch (err) {
      console.error('Error running syncResource', err)
      throw err
    }
  },
)

export const handleWebhook = inngest.createFunction(
  {id: 'Handle webhook'},
  {event: 'webhook/received'},
  ({event: {data}}) => {
    if (data.path.startsWith('connector/')) {
      // TODO: implement me
      console.log('handle connector event', data.path)
    } else {
      console.warn('Unexpected webhook received', data)
    }
  },
)
