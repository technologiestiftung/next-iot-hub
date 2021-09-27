import { Button } from "@components/Button";
import classNames from "classnames";
import * as yup from "yup";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormTextInput } from "@components/FormTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { definitions } from "@common/types/supabase";
import { requiredTokenDescriptionValidation } from "@lib/formValidationUtil";

type TokenFormFields = Pick<definitions["auth_tokens"], "description">;

export interface TokenFormType {
  label?: string;
  placeholder?: string;
  submitMessage?: string;
  onSubmit: () => void;
  additionalClassNames?: string;
}

export const TokenForm: FC<TokenFormType> = ({
  label,
  placeholder = "Beschreibe dein neues Token",
  submitMessage = "Neues Token anlegen",
  onSubmit,
  additionalClassNames,
}) => {
  const formSchema = yup.object().shape({
    description: requiredTokenDescriptionValidation,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TokenFormFields>({
    resolver: yupResolver(formSchema),
  });

  const formatError = (errorMsg?: string): string[] =>
    errorMsg ? [errorMsg] : [];

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(
        "grid md:grid-cols-[1fr,auto] gap-4",
        "py-6",
        additionalClassNames
      )}
    >
      <fieldset className='w-full'>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <FormTextInput
              {...field}
              name='tokenDescription'
              placeholder={placeholder}
              type='text'
              label={label}
              errors={formatError(errors.description?.message)}
              containerClassName='mb-0'
              className='mb-1'
            />
          )}
        />
      </fieldset>
      <Button variant='primary'>{submitMessage}</Button>
    </form>
  );
};
