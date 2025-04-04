import {server as connectorAircall_server} from './aircall'
import {def as connectorAircall_def} from './aircall/def'
import {server as connectorConfluence_server} from './confluence'
import {def as connectorConfluence_def} from './confluence/def'
import {server as connectorDiscord_server} from './discord'
import {def as connectorDiscord_def} from './discord/def'
import {server as connectorGithub_server} from './github'
import {def as connectorGithub_def} from './github/def'
import {server as connectorGooglecalendar_server} from './googlecalendar'
import {def as connectorGooglecalendar_def} from './googlecalendar/def'
import {server as connectorGoogledocs_server} from './googledocs'
import {def as connectorGoogledocs_def} from './googledocs/def'
import {server as connectorGoogledrive_server} from './googledrive'
import {def as connectorGoogledrive_def} from './googledrive/def'
import {server as connectorGooglemail_server} from './googlemail'
import {def as connectorGooglemail_def} from './googlemail/def'
import {server as connectorGooglesheet_server} from './googlesheet'
import {def as connectorGooglesheet_def} from './googlesheet/def'
import {server as connectorHubspot_server} from './hubspot'
import {def as connectorHubspot_def} from './hubspot/def'
import {server as connectorLinear_server} from './linear'
import {def as connectorLinear_def} from './linear/def'
import {server as connectorLinkedin_server} from './linkedin'
import {def as connectorLinkedin_def} from './linkedin/def'
import {server as connectorNotion_server} from './notion'
import {def as connectorNotion_def} from './notion/def'
import {server as connectorQuickbooks_server} from './quickbooks'
import {def as connectorQuickbooks_def} from './quickbooks/def'
import {server as connectorSalesforce_server} from './salesforce'
import {def as connectorSalesforce_def} from './salesforce/def'
import {server as connectorSharepointonline_server} from './sharepointonline'
import {def as connectorSharepointonline_def} from './sharepointonline/def'
import {server as connectorSlack_server} from './slack'
import {def as connectorSlack_def} from './slack/def'

// generated by _generateConnectorLists.ts. Do not modify by hand
export type {JsonConnectorDef} from './def'
export type {AuthType} from './def'

export {
  connectorDiscord_server,
  connectorDiscord_def,
  connectorLinear_server,
  connectorLinear_def,
  connectorQuickbooks_server,
  connectorQuickbooks_def,
  connectorNotion_server,
  connectorNotion_def,
  connectorHubspot_server,
  connectorHubspot_def,
  connectorGithub_server,
  connectorGithub_def,
  connectorConfluence_server,
  connectorConfluence_def,
  connectorSalesforce_server,
  connectorSalesforce_def,
  connectorSlack_server,
  connectorSlack_def,
  connectorGooglemail_server,
  connectorGooglemail_def,
  connectorGooglecalendar_server,
  connectorGooglecalendar_def,
  connectorSharepointonline_server,
  connectorSharepointonline_def,
  connectorGooglesheet_server,
  connectorGooglesheet_def,
  connectorGoogledrive_server,
  connectorGoogledrive_def,
  connectorAircall_server,
  connectorAircall_def,
  connectorGoogledocs_server,
  connectorGoogledocs_def,
  connectorLinkedin_server,
  connectorLinkedin_def,
}
