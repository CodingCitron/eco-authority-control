import { useForm } from "react-hook-form";

import clsx from "clsx";
import { css } from "styled-system/css";

import { useSignIn } from "@/hooks/use-auth";

interface SignInFormValues {
  userId: string;
  password: string;
}

const signInFormClass = css({
  width: "min(400px, 100%)",
});

export default function SignInPage() {
  const signInMutation = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  return (
    <div className="bg-light">
      <main
        id="main-content"
        className="d-flex align-items-center justify-content-center px-4 py-5 min-vh-100"
      >
        <div>
          {/* <h1 className="d-flex justify-content-center mb-4">
            <img src={logo} alt="KORMARC" className={imgCss} />
          </h1> */}
          <form
            noValidate
            onSubmit={handleSubmit(({ userId, password }) => {
              signInMutation.mutate({
                id: userId.trim(),
                password,
              });
            })}
            aria-label="로그인"
            className={signInFormClass}
          >
            <h1 className="visually-hidden">로그인</h1>

            <div className="mb-3">
              <label className="visually-hidden" htmlFor="userId">
                아이디
              </label>
              <input
                {...register("userId", {
                  required: "아이디를 입력해주세요.",
                })}
                aria-describedby={errors.userId ? "userIdError" : undefined}
                aria-invalid={Boolean(errors.userId)}
                autoComplete="username"
                autoFocus
                className={clsx("form-control form-control-lg", {
                  "is-invalid": errors.userId,
                })}
                id="userId"
                placeholder="아이디"
                type="text"
              />
              {errors.userId && (
                <div
                  className="text-danger small mt-1"
                  id="userIdError"
                  role="alert"
                >
                  {errors.userId.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="visually-hidden" htmlFor="password">
                비밀번호
              </label>
              <input
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                })}
                aria-describedby={errors.password ? "passwordError" : undefined}
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                className={clsx("form-control form-control-lg", {
                  "is-invalid": errors.password,
                })}
                id="password"
                placeholder="비밀번호"
                type="password"
              />
              {errors.password && (
                <div
                  className="text-danger small mt-1"
                  id="passwordError"
                  role="alert"
                >
                  {errors.password.message}
                </div>
              )}
            </div>

            {signInMutation.isError && (
              <p className="text-danger small" role="alert">
                아이디 또는 비밀번호를 확인해주세요.
              </p>
            )}

            <button
              className="btn btn-primary btn-lg w-100 fw-bold"
              type="submit"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
