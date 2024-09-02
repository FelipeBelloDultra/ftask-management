import { ReactNode } from "react";

interface StatementChildrenType {
  children: ReactNode;
}

interface StatementProps {
  condition: boolean;
  children: ReactNode;
}

interface ChooseProps {
  children: Array<JSX.Element>;
}

export function If({ children, condition }: StatementProps) {
  if (condition) return children;
}

export function Choose({ children }: ChooseProps) {
  const hasFirstChildWhen = children[0].type.name === "When";
  if (!children.length || !hasFirstChildWhen) {
    throw new Error("Choose component must have at least one When child");
  }

  const filteredChildren = children.filter((child) => {
    const isWhenComponent = child.type.name === "When";
    const isOtherwiseComponent = child.type.name === "Otherwise";

    const isConditionWhenTruthy = Boolean(isWhenComponent && child.props.condition);
    const isConditionOtherwise = Boolean(isOtherwiseComponent && !child.props.condition);

    return isConditionWhenTruthy || isConditionOtherwise;
  });

  return filteredChildren.length > 0 ? filteredChildren[0] : null;
}

export function When({ children, condition }: StatementProps) {
  if (condition) return children;
}

export function Otherwise({ children }: StatementChildrenType) {
  return children;
}
