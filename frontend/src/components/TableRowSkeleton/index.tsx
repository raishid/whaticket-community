import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";

const CustomTableCellStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface TableRowSkeletonProps {
  avatar?: boolean;
  columns?: number;
}

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  avatar,
  columns,
}) => {
  return (
    <>
      <TableRow>
        {avatar && (
          <>
            <TableCell style={{ paddingRight: 0 }}>
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" height={30} width={80} />
            </TableCell>
          </>
        )}
        {Array.from({ length: columns || 0 }, (_, index) => (
          <TableCell align="center" key={index}>
            <CustomTableCellStyled>
              <Skeleton animation="wave" height={30} width={80} />
            </CustomTableCellStyled>
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export default TableRowSkeleton;
