import { useTranslation } from "react-i18next";

interface PageHeaderProps {
  title: string;
  description: string;
  semester: string;
  year: string;
}

const PageHeader = ({
  title,
  description,
  semester,
  year,
}: PageHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-bold text-2xl my-2">{t(title)}</p>
      <p className="text-gray-500 text-sm">
        {t(description)} &middot; {t(semester)} &middot; {t(year)}
      </p>
    </div>
  );
};

export default PageHeader;
