import React from "react";
import { Button, Card, ProgressBar, Stack } from "react-bootstrap";

interface BudgetCardProps {
  name: string;
  amount: number;
  max?: number;
  gray?: boolean;
  hideButtons?: boolean;
  onAddExpenseClick: () => void;
  onViewExpensesClick: () => void;
  date?: Date;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpenseClick,
  onViewExpensesClick,
  date,
}) => {
  const remaining = max ? max - amount : 0;
  const progressPercentage = max ? (amount / max) * 100 : 0;

  const classNames: string[] = [];
  if (amount > (max || 0)) {
    classNames.push("bg-danger", "bg-opacity-10");
  } else if (gray) {
    classNames.push("bg-light");
  }

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
          <div className="me-2">{name}</div>
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex align-items-baseline">
              ${amount.toFixed(2)}
              {max && (
                <span className="text-muted fs-6 ms-1">
                  / ${max.toFixed(2)}
                </span>
              )}
            </div>
            {max && (
              <div className="text-muted fs-6">
                Remaining: ${remaining.toFixed(2)}
              </div>
            )}
          </div>
        </Card.Title>
        
        {date && (
          <div className="text-muted fs-6 mb-2">
            Last Update: {new Date(date).toLocaleDateString()}
          </div>
        )}

        {max && (
          <div>
            <ProgressBar
              className="rounded-pill mb-2"
              variant={getProgressBarVariant(amount, max)}
              min={0}
              max={max}
              now={amount}
            />
            <div className="d-flex justify-content-between text-muted fs-6">
              <span>Progress: {progressPercentage.toFixed(1)}%</span>
              <span>Paid: ${amount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {!hideButtons && (
          <Stack direction="horizontal" gap={2} className="mt-4">
            <Button
              variant="outline-primary"
              className="ms-auto"
              onClick={onAddExpenseClick}
            >
              Add Payments
            </Button>
            <Button onClick={onViewExpensesClick} variant="outline-secondary">
              View Payments
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  );
};

function getProgressBarVariant(amount: number, max: number): "primary" | "warning" | "danger" {
  const ratio = amount / max;
  if (ratio < 0.5) return "primary";
  if (ratio < 0.75) return "warning";
  return "danger";
}

export default BudgetCard;