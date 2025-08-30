from rest_framework import serializers


class TagCreateSerializer(serializers.Serializer):
    """
    创建标签的序列化器
    """
    tag_name = serializers.CharField(max_length=100, min_length=1)
    display_order = serializers.IntegerField(
        min_value=0, max_value=999999, default=0)
    remarks = serializers.CharField(
        max_length=1000, required=False, allow_blank=True)

    def validate_tag_name(self, value):
        """
        验证标签名
        """
        if value.strip() != value:
            raise serializers.ValidationError('标签名不能以空格开头或结尾')
        return value


class TagUpdateSerializer(serializers.Serializer):
    """
    更新标签的序列化器
    """
    tag_name = serializers.CharField(
        max_length=100, min_length=1, required=False)
    display_order = serializers.IntegerField(
        min_value=0, max_value=999999, required=False)
    remarks = serializers.CharField(
        max_length=1000, required=False, allow_blank=True)

    def validate_tag_name(self, value):
        """
        验证标签名
        """
        if value and value.strip() != value:
            raise serializers.ValidationError('标签名不能以空格开头或结尾')
        return value
