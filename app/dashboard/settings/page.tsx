import { Suspense } from 'react';
import AnonymousRecruitmentSwitch from '~/components/AnonymousRecruitmentSwitch';
import DisableAnalyticsSwitch from '~/components/DisableAnalyticsSwitch';
import LimitInterviewsSwitch from '~/components/LimitInterviewsSwitch';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import VersionSection from '~/components/VersionSection';
import SettingsSection from '~/components/layout/SettingsSection';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/Alert';
import { Input } from '~/components/ui/Input';
import PageHeader from '~/components/ui/typography/PageHeader';
import Paragraph from '~/components/ui/typography/Paragraph';
import { env } from '~/env';
import {
  getAppSetting,
  getInstallationId,
  requireAppNotExpired,
} from '~/queries/appSettings';
import { requirePageAuth } from '~/utils/auth';
import AnalyticsButton from '../_components/AnalyticsButton';
import RecruitmentTestSectionServer from '../_components/RecruitmentTestSectionServer';
import ResetButton from '../_components/ResetButton';
import UpdateUploadThingSection from '../_components/UpdateUploadThing';

export default async function Settings() {
  await requireAppNotExpired();
  await requirePageAuth();

  const installationId = await getInstallationId();
  const uploadThingKey = await getAppSetting('uploadThingToken');

  return (
    <>
      <ResponsiveContainer>
        <PageHeader
          headerText="Settings"
          subHeaderText="Here you can configure your installation of Fresco."
        />
      </ResponsiveContainer>
      <ResponsiveContainer className="gap-4">
        <VersionSection />
        <SettingsSection heading="Installation ID">
          <Paragraph margin="none">
            This is the unique identifier for your installation of Fresco. This
            ID is used to track analytics data and for other internal purposes.
          </Paragraph>

          {!!env.INSTALLATION_ID && (
            <Alert variant="info" className="mt-4">
              <AlertTitle>Note:</AlertTitle>
              <AlertDescription>
                This setting is controlled by your <code>.env</code> file, and
                so can only be changed by modifying that file.
              </AlertDescription>
            </Alert>
          )}
          <Input disabled={!!env.INSTALLATION_ID} value={installationId} />
        </SettingsSection>
        <UpdateUploadThingSection uploadThingKey={uploadThingKey ?? ''} />
        <SettingsSection
          heading="Anonymous Recruitment"
          controlArea={
            <Suspense fallback="Loading">
              <AnonymousRecruitmentSwitch />
            </Suspense>
          }
        >
          <Paragraph margin="none">
            If anonymous recruitment is enabled, you may generate an anonymous
            participation URL. This URL can be shared with participants to allow
            them to self-enroll in your study.
          </Paragraph>
        </SettingsSection>
        <SettingsSection
          heading="Limit Interviews"
          controlArea={
            <Suspense fallback="Loading">
              <LimitInterviewsSwitch />
            </Suspense>
          }
        >
          <Paragraph margin="none">
            If this option is enabled, each participant will only be able to
            submit a single <strong>completed</strong> interview for each
            protocol (although they may have multiple incomplete interviews).
            Once an interview has been completed, attempting to start a new
            interview or to resume any other in-progress interview, will be
            prevented.
          </Paragraph>
        </SettingsSection>
        <SettingsSection
          heading="Disable Analytics"
          controlArea={
            <Suspense fallback="Loading">
              <DisableAnalyticsSwitch />
            </Suspense>
          }
        >
          <Paragraph margin="none">
            If this option is enabled, no anonymous analytics data will be sent
            to the Network Canvas team.
          </Paragraph>
          {!!env.DISABLE_ANALYTICS && (
            <Alert variant="info" className="mt-4">
              <AlertTitle>Note:</AlertTitle>
              <AlertDescription>
                This setting is controlled by your <code>.env</code> file, and
                so can only be changed by modifying that file.
              </AlertDescription>
            </Alert>
          )}
        </SettingsSection>
        {(env.NODE_ENV === 'development' || !env.SANDBOX_MODE) && (
          <SettingsSection
            devOnly
            heading="Reset Settings"
            controlArea={<ResetButton />}
          >
            <Paragraph margin="none">
              Delete all data and reset Fresco to its default state.
            </Paragraph>
          </SettingsSection>
        )}
        {env.NODE_ENV === 'development' && (
          // Only show the Analytics and Recruitment test sections in development
          <>
            <SettingsSection
              devOnly
              heading="Send Test Analytics Event"
              controlArea={<AnalyticsButton />}
            >
              <Paragraph margin="none">
                This will send a test analytics event to the Fresco analytics
                server.
              </Paragraph>
            </SettingsSection>
            <RecruitmentTestSectionServer />
          </>
        )}
      </ResponsiveContainer>
    </>
  );
}
