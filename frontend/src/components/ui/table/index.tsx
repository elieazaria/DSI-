// ../ui/table.tsx
import {  HTMLAttributes, forwardRef } from "react";

// Table Component
interface TableProps extends HTMLAttributes<HTMLTableElement> {}
const Table: React.FC<TableProps> = ({ children, className, ...rest }) => {
  return (
    <table className={`min-w-full ${className || ""}`} {...rest}>
      {children}
    </table>
  );
};

// TableHeader Component
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}
const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
};

// TableBody Component
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}
const TableBody: React.FC<TableBodyProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
};

// TableRow Component
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <tr ref={ref} className={className} {...rest}>
        {children}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";

// TableCell Component
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  isHeader?: boolean; // Permet de rendre th ou td
}
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...rest
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={className} {...rest}>
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
