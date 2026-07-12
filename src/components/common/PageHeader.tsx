interface PageHeaderProps {
  title: string;
  description: string;
  semester: string;
  year: string;
}

const PageHeader = ({ title, description, semester, year }: PageHeaderProps) => {
  return (
    <div>
      <p className="font-bold text-2xl my-2">{title}</p>
      <p className="text-gray-500 text-sm">{description} &middot; {semester} &middot; {year}</p>
    </div>
  );
};

export default PageHeader;
