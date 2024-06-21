import React from 'react';
import { FlatList, ListRenderItem, ViewStyle } from 'react-native';

type FollowUp = {
  id: number;
  user: { first_name: string; last_name: string };
  created_at: string;
  details: string;
};

type FollowUpsListProps = {
  followUps: FollowUp[];
  renderItem: ListRenderItem<FollowUp>;
  style?: ViewStyle;
};

const FollowUpsList: React.FC<FollowUpsListProps> = ({ followUps, renderItem, style }) => {
  return (
    <FlatList
      data={followUps}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={style}
    />
  );
};

export default FollowUpsList;
