import React, { FC } from "react";

interface CategoryIconPropType {
  categoryId: number;
  className?: string;
}

const ICONS_MAP = {
  1: "m15.976 10.445-.015.112a3.994 3.994 0 0 1-.024.155l-.018.093a3.136 3.136 0 0 1-.07.285 3.91 3.91 0 0 1-.166.474l-.034.075c-.04.092-.086.183-.134.271l-.048.085.048-.085A4 4 0 0 1 12 14H4a4 4 0 0 1-1.971-7.481 4.002 4.002 0 0 1 3.49-3.49A4 4 0 0 1 13 5l.002 1.126c.045.012.083.022.12.034l-.12-.034c.074.02.148.04.22.064l.054.018c.048.016.095.032.142.05l.044.018c.05.019.098.039.146.06l.039.018c.054.024.107.049.159.075l.024.014c.044.022.087.045.13.069l.041.024.04.022a4 4 0 0 1 .091.056L14 6.536a4.062 4.062 0 0 1 .289.183 3.979 3.979 0 0 1 1.239 1.394l.027.052c.022.042.043.085.064.129l.012.027c.026.054.05.11.073.165A3.91 3.91 0 0 1 16 9.952v.093c0 .133-.009.266-.024.4ZM9 3c-.673 0-1.286.334-1.654.876l-.087.14-.499.878-1.003.12A2.003 2.003 0 0 0 4.04 6.598l-.026.159-.12 1.003-.878.498a2 2 0 0 0 .835 3.736L4 12h8a2 2 0 0 0 1.954-1.57l.024-.134a2.016 2.016 0 0 0-.032-.757l.012.052a2.012 2.012 0 0 0-.04-.16l.028.108a1.992 1.992 0 0 0-.036-.134l.007.026a2.012 2.012 0 0 0-.038-.117l.03.091a1.995 1.995 0 0 0-.053-.15l.023.06a2.009 2.009 0 0 0-.052-.13l.029.07a2 2 0 0 0-.06-.136l.03.066a2.004 2.004 0 0 0-.065-.133l.035.067a2.005 2.005 0 0 0-.077-.141l.042.074a1.997 1.997 0 0 0-.075-.129l.033.055a2.01 2.01 0 0 0-.082-.128l.049.073a1.99 1.99 0 0 0-.094-.135l.045.062a2.011 2.011 0 0 0-.1-.13l.055.068a1.986 1.986 0 0 0-.089-.108l.034.04a2.01 2.01 0 0 0-.084-.095l.05.055a1.984 1.984 0 0 0-.102-.108l.052.053a2.008 2.008 0 0 0-.107-.105l.055.052a1.989 1.989 0 0 0-.126-.114l.071.062a2.003 2.003 0 0 0-.11-.094l.039.032a2.001 2.001 0 0 0-.124-.094l.084.062a1.996 1.996 0 0 0-.117-.085l.033.023a2.024 2.024 0 0 0-.134-.086l.101.063a1.99 1.99 0 0 0-.134-.083l.016.01a2.017 2.017 0 0 0-.302-.143l.045.018A2 2 0 0 0 10.268 9a1 1 0 0 1-1.732-1A3.988 3.988 0 0 1 11 6.127V5a2 2 0 0 0-2-2Z",
  2: "M6 0a3 3 0 0 1 2.995 2.824L9 3l.001 5.124.128.117a4.48 4.48 0 0 1 1.344 2.761l.02.248.007.25c0 2.506-1.968 4.5-4.5 4.5-2.543 0-4.6-2.005-4.6-4.5 0-1.208.488-2.333 1.32-3.16l.17-.16.11-.094V3A3 3 0 0 1 5.65.02l.174-.015L6 0Zm0 2a1 1 0 0 0-.993.883L5 3v6.13l-.456.295A2.469 2.469 0 0 0 3.4 11.5C3.4 12.879 4.55 14 6 14c1.422 0 2.5-1.093 2.5-2.5 0-.786-.34-1.494-.916-1.957l-.148-.11L7 9.135 7 3a1 1 0 0 0-1-1Zm7 4a1 1 0 0 1 0 2h-2a1 1 0 1 1 0-2h2Zm0-4a1 1 0 0 1 0 2h-2a1 1 0 1 1 0-2h2Z",
  3: "m8 .013-.74.814C3.77 4.667 2 7.675 2 10c0 3.412 2.76 6 6 6s6-2.588 6-6c0-2.254-1.664-5.152-4.948-8.826L8 .014Zm-.376 3.43L8 3.007l.111.127C10.716 6.157 12 8.482 12 10c0 2.277-1.837 4-4 4-2.163 0-4-1.723-4-4 0-1.466 1.197-3.684 3.624-6.556Z",
  4: "M8 0a8 8 0 0 1 7.784 9.856l-.08.305-.083.278-.14.402-.059.15-.075.18-.123.27-.114.23a8.005 8.005 0 0 1-.718 1.14l-.237.3-.198.229-.139.15-.14.146-.299.286-.238.208-.243.196-.148.112-.193.138-.112.076a8.008 8.008 0 0 1-.972.557l-.17.079-.356.152-.25.094-.336.112-.34.096-.337.08-.495.09-.205.028-.305.032-.166.012c-.17.01-.34.016-.513.016l-.258-.004-.32-.017-.2-.016-.206-.023-.264-.037-.276-.048-.355-.077-.276-.072-.42-.13-.304-.11-.253-.102a7.957 7.957 0 0 1-.982-.501l-.167-.103-.276-.184-.193-.138-.256-.198-.314-.265-.214-.198-.144-.141-.19-.197-.213-.24-.103-.123A8.012 8.012 0 0 1 .89 11.67l-.157-.321-.08-.178-.134-.33-.105-.294-.105-.336A8 8 0 0 1 8 0Zm0 2a6 6 0 0 0-5.658 8h11.316A6 6 0 0 0 8 2Zm2.643 1.755a1 1 0 0 1 .318 1.378l-2.12 3.392a1 1 0 0 1-1.695-1.06l2.12-3.392a1 1 0 0 1 1.377-.318ZM4 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  5: "M14 5a1 1 0 0 1 0 2h-3v8a1 1 0  0 1-2 0v-4H7v4a1 1 0 0 1-2 0V7H2a1 1 0 1 1 0-2h12ZM8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  6: "M12.695.281c4.407 4.259 4.407 11.179 0 15.438a1 1 0 0 1-1.39-1.438c3.593-3.473 3.593-9.09 0-12.562a1 1 0 0 1 1.39-1.438ZM6.868 2.227A1 1 0 0 1 7 2.723v10.554a1 1 0 0 1-1.496.868l-5-2.857A1 1 0 0 1 0 10.42V5.58a1 1 0 0 1 .504-.868l5-2.857a1 1 0 0 1 1.364.372Zm3.47 1.054a6.524 6.524 0 0 1 0 9.438 1 1 0 0 1-1.39-1.438 4.524 4.524 0 0 0 0-6.562 1 1 0 1 1 1.39-1.438ZM5 4.446 2 6.16v3.679l3 1.714V4.446Z",
};

export const CategoryIcon: FC<CategoryIconPropType> = ({
  categoryId,
  className,
}) => {
  const d = ICONS_MAP[categoryId as keyof typeof ICONS_MAP];
  return categoryId >= 1 && categoryId <= 6 && d ? (
    <svg
      width='16'
      height='16'
      xmlns='http://www.w3.org/2000/svg'
      className={className || ""}
    >
      <path d={d} fill='currentColor' fillRule='nonzero' />
    </svg>
  ) : null;
};
