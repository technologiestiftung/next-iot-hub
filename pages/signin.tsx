import { FC, useState } from "react";
import { SigninForm } from "@components/SigninForm";
import { useAuth } from "@auth/Auth";
import { MagicLinkModal } from "@components/MagicLinkModal";
import { Alert } from "@components/Alert";

const shutdownLevel = parseInt(
  `${process.env.NEXT_PUBLIC_SHUTDOWN_LEVEL || 0}`
);

const preShutdownTexts = {
  title: `Vorsicht!`,
  message: (
    <>
      Stadtpuls wird am <strong>31. Januar 2023</strong> eingestellt.
      <br />
      Ab dann wird es nicht mehr möglich, sich einzuloggen.
    </>
  ),
};
const shutdownTexts = {
  0: preShutdownTexts,
  1: preShutdownTexts,
  2: {
    title: `Login deaktiviert`,
    message: (
      <>
        Stadtpuls wurde am <strong>31. Januar 2023</strong> eingestellt.
        <br />
        Es ist deshalb nicht mehr möglich, sich zu einzuloggen.
      </>
    ),
  },
};

const SigninPage: FC = () => {
  const [emailUsedToSignIn, setEmailUsedToSignIn] = useState<
    string | undefined
  >(undefined);
  const { error, signIn, isAuthenticating, magicLinkWasSent } = useAuth();

  const registrationDataWasSubmitted = isAuthenticating || magicLinkWasSent;

  const shutdownText = shutdownTexts[shutdownLevel as 0 | 1 | 2];

  return (
    <>
      <div
        className='w-full h-full relative flex place-content-center'
        style={{ padding: "calc(7vmax + 62px) 16px 0" }}
      >
        {shutdownLevel >= 0 && (
          <Alert
            type='warning'
            title={shutdownText.title}
            message={shutdownText.message}
            isRemovable={false}
          />
        )}
      </div>
      <div
        className='w-full h-full relative flex place-content-center'
        style={{ padding: "40px 16px 10vmax" }}
      >
        {shutdownLevel < 2 && (
          <>
            {!registrationDataWasSubmitted && (
              <SigninForm
                onSubmit={data => {
                  void signIn(data);
                  setEmailUsedToSignIn(data.email);
                }}
                serverError={error}
                defaultValues={{ email: emailUsedToSignIn }}
              />
            )}
            {registrationDataWasSubmitted && (
              <MagicLinkModal
                isLoading={isAuthenticating && !magicLinkWasSent}
                email={emailUsedToSignIn || ""}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SigninPage;
