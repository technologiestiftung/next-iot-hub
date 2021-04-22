import { useAuth } from "@auth/Auth";
import { createTokenApiUrl } from "@lib/requests/createTokenApiUrl";
import { useCallback } from "react";
import useSWR, { mutate } from "swr";

interface TokenType {
  projectId: string;
  description: string;
  niceId: string;
}

type AccessTokenType = string;
type AuthTokenType = string;

interface GetTokensPayload {
  projectId: TokenType["projectId"];
}

interface CreateTokenPayload {
  projectId: TokenType["projectId"];
  description: TokenType["description"];
}

type GetProjectTokensSignature = (
  params: GetTokensPayload & {
    accessToken: AccessTokenType;
  }
) => Promise<TokenType[]>;

type CreateProjectTokenSignature = (
  params: CreateTokenPayload & {
    accessToken: AccessTokenType;
  }
) => Promise<string>;

const createProjectToken: CreateProjectTokenSignature = async ({
  accessToken,
  ...payload
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow" as const,
    body: JSON.stringify(payload),
  };

  const rawToken = await fetch(createTokenApiUrl(), requestOptions);
  const stringToken = await rawToken.text();
  return stringToken;
};

const getProjectTokens: GetProjectTokensSignature = async ({
  accessToken,
  projectId,
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as const,
  };

  const url = createTokenApiUrl({ projectId });
  const rawTokens = await fetch(url, requestOptions);
  const response = await (rawTokens.json() as Promise<{
    data: TokenType[];
  }>);
  return response.data;
};

const getTokensSWRFetcher = async (
  projectId: TokenType["projectId"],
  accessToken: AccessTokenType | null
): Promise<TokenType[] | null> => {
  if (!accessToken) return null;
  return getProjectTokens({
    accessToken,
    projectId,
  });
};

interface ProjectTokensHookReturnType {
  tokens: TokenType[] | null;
  error: Error | null;
  createToken: (
    description: TokenType["description"]
  ) => Promise<AuthTokenType>;
}

export const useProjectTokens = (
  projectId: number
): ProjectTokensHookReturnType => {
  const { accessToken } = useAuth();
  const tokensParams = [`use-tokens-${projectId}`, accessToken];
  const { data: tokens, error } = useSWR<TokenType[] | null, Error>(
    tokensParams,
    () => getTokensSWRFetcher(`${projectId}`, accessToken)
  );

  const createToken = useCallback(
    async (description: string) => {
      if (!accessToken)
        throw new Error("Invalid accessToken while creating a token");
      const token = await createProjectToken({
        projectId: String(projectId),
        description,
        accessToken,
      });
      await mutate([`use-tokens-${projectId}`, accessToken]);
      return token;
    },
    [accessToken, projectId]
  );

  return {
    tokens: tokens || null,
    error: error || null,
    createToken: createToken,
  };
};
