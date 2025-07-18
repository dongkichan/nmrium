import styled from '@emotion/styled';
import type { CSSProperties, ReactNode } from 'react';

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  background-color: #f7f7f7;
  height: 30px;
  padding: 6px;
  color: #8d0018;
  position: absolute;
  width: 100%;
  bottom: 0;
  container-type: inline-size;
`;

interface InfoContainerProps {
  /** Whether to auto-hide the element based on threshold (default: `false`) */
  autoHide?: boolean;
  /** Hide threshold in pixel (default: `600`) */
  hideThreshold?: number;
  /** The  display property (default: `'inline-block'`) */
  display?: CSSProperties['display'];
}

const InfoContainer = styled.div<InfoContainerProps>`
  margin: 0 10px;
  display: ${({ display = 'inline-block' }) => display};

  @container (max-width:${({ hideThreshold = 600 }) => hideThreshold}px) {
    display: ${({ autoHide = false, display = 'inline-block' }) =>
      autoHide ? 'none' : display};
  }
`;

interface InfoItemProps extends InfoContainerProps {
  children: ReactNode;
  className?: string;
}

function InfoItem(props: InfoItemProps) {
  const {
    children,
    autoHide = false,
    display = 'inline-block',
    className,
    hideThreshold,
  } = props;
  return (
    <InfoContainer
      autoHide={autoHide}
      display={display}
      className={className}
      hideThreshold={hideThreshold}
    >
      {children}
    </InfoContainer>
  );
}

const Span = styled.span`
  font-weight: bold;
`;

InfoItem.Label = styled(Span)`
  font-size: 12px;
  color: #4d4d4d;
`;

InfoItem.Value = styled(Span)`
  font-size: 14px;
  display: inline-block;
`;

InfoItem.Unit = styled(Span)`
  font-size: 10px;
`;

export { FooterContainer, InfoItem };
