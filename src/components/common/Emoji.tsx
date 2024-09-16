export default function Emoji({ ...props }: any) {
	if(!props.id) return null
	return (
		// @ts-ignore
		<em-emoji {...props} />
	);
}
