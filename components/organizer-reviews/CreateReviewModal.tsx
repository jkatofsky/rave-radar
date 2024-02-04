import {
	Button,
	Fieldset,
	InputWrapper,
	Modal,
	MultiSelect,
	NumberInput,
	Rating,
	Space,
	Textarea,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Genre, Organizer, Review } from '@prisma/client';
import { useRouter } from 'next/navigation';

import { RATINGS_INFO } from '../../lib/constants';

export default function CreateReviewModal({
	opened,
	organizer,
	onClose,
	onCreateReview,
}: {
	opened: boolean;
	organizer: Organizer;
	onClose: () => void;
	onCreateReview: (review: Review) => Promise<void>;
}) {
	const router = useRouter();

	//TODO: ZOD!
	const form = useForm<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>({
		initialValues: {
			organizerId: organizer.id,
			description: '',
			genres: [],
			moneySpent: null,
			// TODO: avoid hardcoding all these?
			soundSystemRating: 0,
			djAndMusicRating: 0,
			crowdPlurRating: 0,
			safetyAndComfortRating: 0,
			venueRating: 0,
			valueForMoneyRating: 0,
			visualsRating: null,
			staffRating: null,
			foodAndDrinkRating: null,
		},
	});

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={<Title order={3}>Add a review of {organizer.name}</Title>}
			centered
			size="xl"
		>
			<form
				onSubmit={form.onSubmit((values) => {
					onCreateReview(values as Review);
					router.refresh();
					onClose();
				})}
			>
				<Fieldset legend="Basic information">
					<Textarea
						{...form.getInputProps('description')}
						label="Description"
						description={`Describe your experience at ${organizer.name}`}
						withAsterisk
					/>
					<Space h="sm" />
					<MultiSelect
						{...form.getInputProps('genres')}
						label="Genres"
						description={`Which genres were played at ${organizer.name}?`}
						data={Object.keys(Genre)}
						searchable
						withAsterisk
					/>
					<Space h="sm" />
					<NumberInput
						{...form.getInputProps('moneySpent')}
						label="Money spent"
						description={`Roughly how much did you spend in your visit to ${organizer.name}?`}
						min={0}
						step={5}
						prefix="$"
					/>
				</Fieldset>
				<Space h="md" />
				<Fieldset legend="Rating categories">
					{/* TODO: make the stars bigger */}
					{[...RATINGS_INFO.entries()].map((ratingInfo, index) => (
						<InputWrapper
							key={index}
							label={ratingInfo[1].title}
							description={
								typeof ratingInfo[1].creationDescription === 'function'
									? ratingInfo[1].creationDescription(organizer)
									: ratingInfo[1].creationDescription
							}
							withAsterisk={ratingInfo[1].required}
							m="xs"
						>
							<Rating {...form.getInputProps(ratingInfo[0])} count={5} />
						</InputWrapper>
					))}
				</Fieldset>
				<Space h="sm" />
				<Button type="submit" fullWidth>
					Submit review
				</Button>
			</form>
		</Modal>
	);
}
